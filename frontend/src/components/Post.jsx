import React, { useContext, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MapPin } from 'lucide-react';
import { GeneralContext } from '../context/GeneralContextProvider';
import axios from 'axios';
import toast from 'react-hot-toast';

/* ── Relative time ─────────────────────────────── */
const timeAgo = (date) => {
  if (!date) return 'just now';
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) !== 1 ? 's' : ''} ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

/* ══ POST CARD ══════════════════════════════════ */
const Post = () => {
  const { socket } = useContext(GeneralContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedPosts')) ?? []; }
    catch { return []; }
  });
  const [expanded, setExpanded] = useState({});
  const userId = localStorage.getItem('userId');

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('http://localhost:6001/fetchAllPosts');
      setPosts(data ?? []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    socket.on('post-deleted', ({ posts }) => setPosts(posts ?? []));
    socket.on('posts-updated', ({ posts }) => setPosts(posts ?? []));
    socket.on('post-updated', (updated) => setPosts(prev => prev.map(p => p._id === updated._id ? updated : p)));
    return () => {
      socket.off('post-deleted');
      socket.off('posts-updated');
      socket.off('post-updated');
    };
  }, [socket]);

  const handleLike = useCallback((postId) => {
    const post = posts.find(p => p._id === postId);
    if (!post) return;
    if (post.likes.includes(userId)) {
      socket.emit('postUnLiked', { userId, postId });
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, likes: p.likes.filter(id => id !== userId) } : p));
    } else {
      socket.emit('postLiked', { userId, postId });
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, likes: [...p.likes, userId] } : p));
    }
  }, [posts, userId, socket]);

  const handleSave = useCallback((postId) => {
    setSavedPosts(prev => {
      const has = prev.includes(postId);
      const updated = has ? prev.filter(id => id !== postId) : [...prev, postId];
      localStorage.setItem('savedPosts', JSON.stringify(updated));
      if (!has) toast.success('Saved ✨');
      return updated;
    });
  }, []);

  const handleDelete = useCallback((postId) => {
    socket.emit('delete-post', { postId });
    toast.success('Post deleted');
  }, [socket]);

  /* ── Skeletons ── */
  if (loading) return (
    <div>
      {[1, 2, 3].map(i => (
        <div key={i} className="post-card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', padding: '14px 16px', gap: 16 }}>
            <div className="skeleton" style={{ width: 220, height: 160, borderRadius: 12, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 18, width: '80%', marginBottom: 10, borderRadius: 6 }} />
              <div className="skeleton" style={{ height: 13, width: '100%', marginBottom: 6, borderRadius: 6 }} />
              <div className="skeleton" style={{ height: 13, width: '70%', marginBottom: 6, borderRadius: 6 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (posts.length === 0) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: '56px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>📭</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>No posts yet</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Be the first to share something!</p>
    </motion.div>
  );

  return (
    <div>
      {posts.map((post, idx) => {
        const isLiked = post.likes?.includes(userId);
        const isSaved = savedPosts.includes(post._id);
        const isOwn = post.userId === userId;
        const isExp = expanded[post._id];
        const likeCount = post.likes?.length ?? 0;

        return (
          <motion.div
            key={post._id}
            className="post-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.06, 0.4), duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="post-card-inner" style={{ position: 'relative' }}>
              {/* Thumbnail */}
              <div className="post-card-thumb">
                <div className="post-card-thumb-overlay" />
                {post.fileType === 'photo' ? (
                  <img src={post.file} alt="" />
                ) : (
                  <video src={post.file} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 180 }} />
                )}
              </div>

              {/* Body */}
              <div className="post-card-body">
                {/* Share */}
                <button className="post-card-share" style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Share2 size={16} />
                </button>

                <h2 className="post-card-title">{post.description || 'Untitled post'}</h2>

                {post.location && (
                  <p style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--accent)', marginBottom: 8, fontWeight: 500 }}>
                    <MapPin size={12} /> {post.location}
                  </p>
                )}

                <p className="post-card-desc">
                  {post.description ?? ''}
                </p>

                <button
                  onClick={() => setExpanded(prev => ({ ...prev, [post._id]: !isExp }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--accent)', fontWeight: 600, padding: 0, fontFamily: 'var(--font)', marginBottom: 12, textAlign: 'left' }}
                >
                  {isExp ? 'Show less' : 'Read More...'}
                </button>

                {/* Comments panel */}
                <AnimatePresence>
                  {isExp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden', marginBottom: 10 }}
                    >
                      <div style={{ maxHeight: 120, overflowY: 'auto', marginBottom: 8 }}>
                        {post.comments?.slice(-4).map((c, i) => (
                          <p key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 5px', lineHeight: 1.5 }}>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)', marginRight: 6 }}>{c[0]}</span>{c[1]}
                          </p>
                        ))}
                        {(!post.comments || post.comments.length === 0) && (
                          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No comments yet.</p>
                        )}
                      </div>
                      {isOwn && (
                        <button
                          onClick={() => handleDelete(post._id)}
                          style={{ fontSize: 12, color: 'var(--danger)', background: 'none', border: '1px solid var(--danger)', borderRadius: 20, padding: '3px 10px', cursor: 'pointer', fontFamily: 'var(--font)' }}
                        >
                          Delete post
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer */}
                <div className="post-card-footer">
                  <div className="post-card-author">
                    <img
                      src={post.userPic || ''}
                      alt={post.userName}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div>
                      <div className="post-card-author-name">{post.userName}</div>
                      <div className="post-card-author-time">{timeAgo(post.createdAt)}</div>
                    </div>
                  </div>

                  <div className="post-card-stats">
                    {/* Like */}
                    <motion.button
                      className={`post-stat ${isLiked ? 'liked' : ''}`}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => handleLike(post._id)}
                    >
                      <span className="post-stat-icon">
                        <Heart size={14} fill={isLiked ? '#FF5B5B' : 'none'} color={isLiked ? '#FF5B5B' : 'var(--text-secondary)'} />
                      </span>
                      <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
                    </motion.button>

                    {/* Comment */}
                    <button className="post-stat" onClick={() => setExpanded(prev => ({ ...prev, [post._id]: !isExp }))}>
                      <span className="post-stat-icon">
                        <MessageCircle size={14} color="var(--text-secondary)" />
                      </span>
                      <span>{post.comments?.length ?? 0} Comments</span>
                    </button>

                    {/* Save */}
                    <motion.button
                      className="post-stat"
                      whileTap={{ scale: 0.8 }}
                      onClick={() => handleSave(post._id)}
                      style={{ color: isSaved ? 'var(--accent)' : undefined }}
                    >
                      <span className="post-stat-icon">
                        <Bookmark size={14} fill={isSaved ? 'var(--accent)' : 'none'} color={isSaved ? 'var(--accent)' : 'var(--text-secondary)'} />
                      </span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Post;