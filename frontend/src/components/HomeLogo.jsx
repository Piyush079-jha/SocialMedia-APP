import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, X } from 'lucide-react';
import { GeneralContext } from '../context/GeneralContextProvider';
import { useNavigate } from 'react-router-dom';

const HomeLogo = () => {
  const { socket, setNotificationsOpen } = useContext(GeneralContext);
  const [search, setSearch] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [focused, setFocused] = useState(false);
  const [hasNotif] = useState(true); // demo notification dot
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = useCallback(() => {
    const trimmed = search.trim();
    if (!trimmed) return;
    socket.emit('user-search', { username: trimmed });
  }, [search, socket]);

  useEffect(() => {
    const handler = ({ user }) => {
      setSearchedUser(user ?? null);
    };
    socket.on('searched-user', handler);
    return () => socket.off('searched-user', handler);
  }, [socket]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false);
        setSearchedUser(null);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Get greeting sub-text
  const getSubtext = () => {
    const h = new Date().getHours();
    if (h < 12) return 'MORNING GLOW';
    if (h < 17) return 'SOFT LIGHT';
    if (h < 20) return 'GOLDEN HOUR';
    return 'NIGHT MODE';
  };

  return (
    <header className="nx-topbar">
      {/* Left: Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          fontStyle: 'italic',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #F4849A 0%, #C489E0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.5px',
          lineHeight: 1.1,
        }}>
          Lumina
        </span>
        <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.18em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          marginTop: 1,
        }}>
          TODAY · {getSubtext()}
        </span>
      </div>

      {/* Right: Search + Bell */}
      <div ref={containerRef} style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
        {/* Search button */}
        <AnimatePresence mode="wait">
          {focused ? (
            <motion.div
              key="search-open"
              initial={{ width: 40, opacity: 0 }}
              animate={{ width: 180, opacity: 1 }}
              exit={{ width: 40, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-full)',
                boxShadow: 'var(--shadow-neu-sm)',
                display: 'flex', alignItems: 'center',
                padding: '0 14px', gap: 8, height: 40,
                border: '1px solid rgba(244,132,154,0.2)',
                overflow: 'hidden',
              }}
            >
              <Search size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={search}
                onChange={e => { setSearch(e.target.value); if (e.target.value.trim()) handleSearch(); }}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search…"
                autoFocus
                style={{
                  border: 'none', outline: 'none', background: 'transparent',
                  fontSize: 13, color: 'var(--text-primary)', flex: 1,
                  fontFamily: 'var(--font-body)',
                }}
              />
              {search && (
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setSearch('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex' }}>
                  <X size={13} />
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.button
              key="search-closed"
              className="icon-btn"
              whileTap={{ scale: 0.9 }}
              onClick={() => setFocused(true)}
              style={{ background: 'var(--bg-card)', flexShrink: 0 }}
            >
              <Search size={17} color="var(--text-secondary)" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Search result dropdown */}
        <AnimatePresence>
          {focused && searchedUser && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute', top: 48, right: 52,
                background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-post)', padding: 12,
                minWidth: 200, zIndex: 50,
                border: '1px solid rgba(255,255,255,0.9)',
              }}
            >
              <motion.div
                whileHover={{ background: 'var(--bg-surface)' }}
                onClick={() => { navigate(`/profile/${searchedUser._id}`); setFocused(false); setSearch(''); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                  borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'background 0.15s',
                }}
              >
                <img src={searchedUser.profilePic || ''} alt="" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--accent-soft)' }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{searchedUser.username}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{searchedUser.followers?.length ?? 0} followers</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bell */}
        <motion.button
          className="icon-btn"
          whileTap={{ scale: 0.9 }}
          onClick={() => setNotificationsOpen(true)}
          style={{ background: 'var(--bg-card)', flexShrink: 0, position: 'relative' }}
        >
          <Bell size={17} color="var(--text-secondary)" />
          {hasNotif && (
            <span style={{
              position: 'absolute', top: 9, right: 9,
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--accent)',
              border: '2px solid var(--bg-card)',
            }} />
          )}
        </motion.button>
      </div>
    </header>
  );
};

export default HomeLogo;