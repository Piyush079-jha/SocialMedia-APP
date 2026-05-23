import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const RING_CLASSES = ['story-ring-g1','story-ring-g2','story-ring-g3','story-ring-g4','story-ring-g5'];

/* ── Full-screen Story Viewer ── */
const StoryViewer = ({ users, startIdx, onClose }) => {
  const [current, setCurrent] = useState(startIdx);
  const [progress, setProgress] = useState(0);
  const DURATION = 5000;

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const id = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(id);
        if (current < users.length - 1) setCurrent(c => c + 1);
        else onClose();
      }
    }, 50);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') { if (current < users.length - 1) setCurrent(c => c + 1); else onClose(); }
      if (e.key === 'ArrowLeft') { if (current > 0) setCurrent(c => c - 1); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const user = users[current];
  return (
    <motion.div className="story-viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        initial={{ scale: 0.88 }} animate={{ scale: 1 }} exit={{ scale: 0.88 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', width: '100%', maxWidth: 360, height: 'min(640px,92dvh)', background: '#0d0f1a', borderRadius: 24, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}
      >
        {/* Progress */}
        <div style={{ position: 'absolute', top: 10, left: 12, right: 12, zIndex: 10, display: 'flex', gap: 4 }}>
          {users.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 2.5, background: 'rgba(255,255,255,0.25)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#fff', borderRadius: 2, width: i < current ? '100%' : i === current ? `${progress}%` : '0%' }} />
            </div>
          ))}
        </div>
        {/* Header */}
        <div style={{ position: 'absolute', top: 20, left: 14, right: 14, zIndex: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={user?.profilePic || ''} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)', background: '#333' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', flex: 1 }}>{user?.username}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 4 }}><X size={18} /></button>
        </div>
        {/* Media / placeholder */}
        <div style={{ width: '100%', height: '100%', background: `linear-gradient(160deg,${['#4F75FF22','#F59E0B22','#EC489922'][current % 3]} 0%,#0d0f1a 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {user?.profilePic
            ? <img src={user.profilePic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65 }} />
            : <span style={{ fontSize: 72 }}>✨</span>}
        </div>
        <button onClick={() => { if (current > 0) setCurrent(c => c - 1); }} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '35%', background: 'none', border: 'none' }} />
        <button onClick={() => { if (current < users.length - 1) setCurrent(c => c + 1); else onClose(); }} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '35%', background: 'none', border: 'none' }} />
      </motion.div>
      {current > 0 && <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrent(c => c - 1)} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={18} /></motion.button>}
      {current < users.length - 1 && <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrent(c => c + 1)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={18} /></motion.button>}
    </motion.div>
  );
};

/* ══ STORIES STRIP ══ */
const Stories = () => {
  const [users, setUsers] = useState([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIdx, setViewerIdx] = useState(0);
  const me = {
    _id: localStorage.getItem('userId'),
    username: localStorage.getItem('username'),
    profilePic: localStorage.getItem('profilePic'),
  };

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('http://localhost:6001/fetchAllUsers');
        setUsers((data ?? []).filter(u => u._id !== me._id));
      } catch { /* silent */ }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const all = [me, ...users.slice(0, 10)];

  return (
    <>
      <div className="stories-row">
        <div className="stories-inner">
          {/* Add story */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <div className="story-add-btn"><Plus size={24} /></div>
            <span className="story-name" style={{ color: 'var(--accent)', fontWeight: 600 }}>Your story</span>
          </div>
          {/* Story circles */}
          {all.map((user, i) => (
            <motion.div
              key={user._id || i}
              className="story-circle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => { if (i > 0) { setViewerIdx(i - 1); setViewerOpen(true); } }}
            >
              <div className={`story-ring ${RING_CLASSES[i % RING_CLASSES.length]}`}>
                <div className="story-avatar-wrap">
                  <img src={user.profilePic || ''} alt={user.username} onError={e => { e.target.style.display = 'none'; }} />
                </div>
              </div>
              <span className="story-name">{i === 0 ? 'You' : user.username}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {viewerOpen && (
          <StoryViewer users={users} startIdx={viewerIdx} onClose={() => setViewerOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Stories;