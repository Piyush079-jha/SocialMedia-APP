import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Heart, MessageCircle, Info } from 'lucide-react';
import axios from 'axios';
import Topbar from '../components/Topbar';
import Notifications from '../components/Notifications';
import CreatePost from '../components/CreatePost';
import useWindowWidth from '../hooks/useWindowWidth';

const Saved = () => {
  const [posts, setPosts] = useState([]);
  const [savedIds, setSavedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedPosts')) ?? []; }
    catch { return []; }
  });
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const { data } = await axios.get('http://localhost:6001/fetchAllPosts');
      setPosts(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // For demo: show user's own posts as "saved"
  const savedPosts = posts.filter(p => p.userId === userId || savedIds.includes(p._id));

  const handleUnsave = (postId) => {
    setSavedIds(ids => {
      const updated = ids.filter(id => id !== postId);
      localStorage.setItem('savedPosts', JSON.stringify(updated));
      return updated;
    });
  };

  const width  = useWindowWidth();
  const isMobile = width <= 768;

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
          style={{ padding: '24px 0 32px', display: 'flex', alignItems: 'center', gap: 16 }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: 18,
            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bookmark size={26} color="#fff" fill="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-1px', margin: 0, color: 'var(--text-primary)' }}>
              Saved
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4, marginBottom: 0 }}>
              {savedPosts.length} {savedPosts.length === 1 ? 'post' : 'posts'} saved
            </p>
          </div>
        </motion.div>

        {/* Info banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{
            background: 'rgba(139,92,246,0.08)', border: '1px solid var(--border-acc)',
            borderRadius: 'var(--radius-lg)', padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24,
          }}
        >
          <Info size={16} color="var(--accent)" />
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
            Only you can see what you've saved. Your saved posts are private.
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="profile-grid" style={{ gap: 3 }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="skeleton-line" style={{ aspectRatio: 1, borderRadius: 0 }} />
            ))}
          </div>
        ) : savedPosts.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '80px 24px' }}>
            <motion.div
              animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ display: 'inline-flex', width: 80, height: 80, borderRadius: 24, background: 'var(--bg-elevated)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}
            >
              <Bookmark size={36} color="var(--text-muted)" />
            </motion.div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Nothing saved yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
              Tap the bookmark icon on posts to save them for later.
            </p>
          </motion.div>
        ) : (
          <div className="profile-grid" style={{ gap: 3 }}>
            {savedPosts.map((post, i) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.04, 0.5) }}
                className="profile-grid-item"
                onClick={() => setSelectedPost(post)}
              >
                {post.fileType === 'photo' ? (
                  <img src={post.file} alt="" loading="lazy" />
                ) : (
                  <video muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                    <source src={post.file} />
                  </video>
                )}
                <div className="grid-overlay">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff' }}>
                    <Heart size={18} fill="#fff" />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{post.likes?.length ?? 0}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff' }}>
                    <MessageCircle size={18} fill="#fff" />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{post.comments?.length ?? 0}</span>
                  </div>
                </div>
                {/* Bookmark badge */}
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }}
                    onClick={e => { e.stopPropagation(); handleUnsave(post._id); }}
                    style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', cursor: 'pointer', width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
                  >
                    <Bookmark size={14} fill="#fff" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: 500, width: '100%', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
            >
              {selectedPost.fileType === 'photo' ? (
                <img src={selectedPost.file} alt="" style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', background: '#000' }} />
              ) : (
                <video controls autoPlay muted style={{ width: '100%', maxHeight: '70vh', background: '#000' }}>
                  <source src={selectedPost.file} />
                </video>
              )}
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <img src={selectedPost.userPic || ''} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
                  <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{selectedPost.userName}</span>
                </div>
                {selectedPost.description && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{selectedPost.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Notifications />
      <CreatePost />
    </div>
  );
};

export default Saved;
