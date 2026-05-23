import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, X, Send, Bookmark, MapPin } from 'lucide-react';
import axios from 'axios';
import { GeneralContext } from '../context/GeneralContextProvider';
import Topbar from '../components/Topbar';
import Notifications from '../components/Notifications';
import CreatePost from '../components/CreatePost';
import useWindowWidth from '../hooks/useWindowWidth';

/* ── Skeleton loader ─────────────────────────────────────────── */
const SkeletonGrid = () => (
  <div className="explore-grid" style={{ gap: 3 }}>
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        className="skeleton-line"
        style={{
          aspectRatio: i % 5 === 0 ? '1/2' : '1',
          marginBottom: 3,
          borderRadius: 0,
          minHeight: 120,
        }}
      />
    ))}
  </div>
);

/* ── Post Detail Modal ───────────────────────────────────────── */
const PostModal = ({ post, onClose, socket }) => {
  const [comments, setComments] = useState('');
  const userId = localStorage.getItem('userId');
  const [isLiked, setIsLiked] = useState(post?.likes?.includes(userId));
  const [likesCount, setLikesCount] = useState(post?.likes?.length ?? 0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleLike = () => {
    if (isLiked) {
      socket.emit('postUnLiked', { userId, postId: post._id });
      setIsLiked(false); setLikesCount(c => c - 1);
    } else {
      socket.emit('postLiked', { userId, postId: post._id });
      setIsLiked(true); setLikesCount(c => c + 1);
    }
  };

  const handleComment = () => {
    if (!comments.trim()) return;
    socket.emit('makeComment', { postId: post._id, username: localStorage.getItem('username'), comment: comments });
    setComments('');
  };

  if (!post) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="post-modal-backdrop"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="post-modal-inner"
        onClick={e => e.stopPropagation()}
      >
        {/* Media side */}
        <div className="post-modal-media">
          {post.fileType === 'photo' ? (
            <img src={post.file} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '90vh' }} />
          ) : (
            <video controls autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '90vh' }}>
              <source src={post.file} />
            </video>
          )}
        </div>

        {/* Details side */}
        <div className="post-modal-detail">
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', padding: 2,
              }}>
                <img src={post.userPic || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--bg-base)' }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{post.userName}</p>
                {post.location && (
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <MapPin size={9} /> {post.location}
                  </p>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </motion.button>
            </div>
          </div>

          {/* Description */}
          {post.description && (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', marginRight: 6 }}>{post.userName}</span>
                {post.description}
              </p>
            </div>
          )}

          {/* Comments */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {post.comments?.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <p style={{ fontSize: 22, marginBottom: 8 }}>💬</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No comments yet</p>
              </div>
            )}
            {post.comments?.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-elevated)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                  {c[0]?.[0]?.toUpperCase()}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', marginRight: 6 }}>{c[0]}</span>
                  {c[1]}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ borderTop: '1px solid var(--border)', padding: '12px 16px', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }}
                  onClick={handleLike}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: isLiked ? '#EC4899' : 'var(--text-secondary)', padding: 0 }}
                >
                  <Heart size={24} fill={isLiked ? '#EC4899' : 'none'} strokeWidth={isLiked ? 0 : 2} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', padding: 0 }}>
                  <MessageCircle size={24} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', padding: 0 }}>
                  <Send size={22} />
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }}
                onClick={() => setIsSaved(s => !s)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? 'var(--accent)' : 'var(--text-secondary)', padding: 0 }}
              >
                <Bookmark size={24} fill={isSaved ? 'var(--accent)' : 'none'} />
              </motion.button>
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>
              {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
            </p>

            {/* Comment input */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                className="input-premium"
                placeholder="Add a comment…"
                value={comments}
                onChange={e => setComments(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleComment()}
                style={{ borderRadius: 'var(--radius-full)', padding: '9px 16px', fontSize: 13 }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleComment}
                disabled={!comments.trim()}
                style={{
                  background: comments.trim() ? 'var(--accent)' : 'var(--bg-elevated)',
                  color: comments.trim() ? '#fff' : 'var(--text-muted)',
                  border: 'none', borderRadius: 10, padding: '9px 16px',
                  fontSize: 13, fontWeight: 600, cursor: comments.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s', flexShrink: 0,
                }}
              >
                Post
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Explore Page ─────────────────────────────────────────────── */
const Explore = () => {
  const { socket } = useContext(GeneralContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [filter, setFilter] = useState('all');

  const FILTERS = ['all', 'photo', 'video'];
  const isMobile = useWindowWidth() <= 768;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('http://localhost:6001/fetchAllPosts');
      setPosts(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = filter === 'all' ? posts : posts.filter(p => p.fileType === filter);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Topbar />
      <div style={{
        maxWidth: 935, margin: '0 auto',
        padding: isMobile
          ? 'calc(var(--topbar-h) + 12px) 10px 72px'
          : 'calc(var(--topbar-h) + 16px) 16px 40px',
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: '24px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}
        >
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}>
              Explore
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4, marginBottom: 0 }}>
              Discover what the world is creating
            </p>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 8, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', padding: 4 }}>
            {FILTERS.map(f => (
              <motion.button
                key={f} whileTap={{ scale: 0.94 }}
                onClick={() => setFilter(f)}
                style={{
                  padding: '7px 18px', borderRadius: 'var(--radius-full)', border: 'none',
                  background: filter === f ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'transparent',
                  color: filter === f ? '#fff' : 'var(--text-muted)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                  transition: 'all 0.2s',
                }}
              >
                {f}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div style={{ padding: '0 0' }}>
          {loading ? (
            <SkeletonGrid />
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px 24px' }}>
              <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Nothing here yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Be the first to share something!</p>
            </motion.div>
          ) : (
            <div className="explore-grid">
              {filtered.map((post, i) => (
                <motion.div
                  key={post._id}
                  className="explore-item"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.03, 0.4) }}
                  style={{
                    aspectRatio: i % 7 === 0 ? '1/1.5' : '1',
                    background: 'var(--bg-elevated)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedPost(post)}
                >
                  {post.fileType === 'photo' ? (
                    <img src={post.file} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                  ) : (
                    <video muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
                      <source src={post.file} />
                    </video>
                  )}
                  <div className="explore-overlay">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff' }}>
                      <Heart size={20} fill="#fff" />
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{post.likes?.length ?? 0}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff' }}>
                      <MessageCircle size={20} fill="#fff" />
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{post.comments?.length ?? 0}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedPost && (
          <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} socket={socket} />
        )}
      </AnimatePresence>
      <Notifications />
      <CreatePost />
    </div>
  );
};

export default Explore;
