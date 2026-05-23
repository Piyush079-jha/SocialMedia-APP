import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Menu, X, Home, Compass, Film, Bookmark } from 'lucide-react';
import axios from 'axios';
import { GeneralContext } from '../context/GeneralContextProvider';
import NeXoraLogo from './NeXoraLogo';
import SearchDropdown from './Search';

const NAV_LINKS = [
  { label: 'Home',    path: '/',        icon: Home },
  { label: 'Explore', path: '/explore', icon: Compass },
  { label: 'Reels',   path: '/reels',   icon: Film },
  { label: 'Saved',   path: '/saved',   icon: Bookmark },
];

const Topbar = () => {
  const navigate  = useNavigate();
  const { setNotificationsOpen } = useContext(GeneralContext);

  // State
  const [theme, setTheme]               = useState(() => localStorage.getItem('nexora-theme') || 'dark');
  const [searchQuery, setSearchQuery]   = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef   = useRef(null);
  const mobileSearchRef = useRef(null);

  const profilePic = localStorage.getItem('profilePic');
  const username   = localStorage.getItem('username') || 'User';
  const userId     = localStorage.getItem('userId');

  // Current path
  const currentPath = window.location.pathname;
  const isActive = (path) => path === '/' ? currentPath === '/' : currentPath.startsWith(path);

  // Theme toggle
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('nexora-theme', next);
  };

  // Search
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) { setSearchedUser(null); return; }
    const id = setTimeout(async () => {
      try {
        const { data } = await axios.get(`http://localhost:6001/searchUser?username=${q}`);
        setSearchedUser(data || null);
      } catch { setSearchedUser(null); }
    }, 350);
    return () => clearTimeout(id);
  }, [searchQuery]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [currentPath]);

  // Close menu on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e) => {
      if (!e.target.closest('.mobile-menu-panel') && !e.target.closest('.mobile-menu-toggle')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="topbar">
        {/* ── Logo ── */}
        <div className="topbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', flexShrink: 0 }}>
          <NeXoraLogo />
        </div>

        {/* ── Desktop Search ── */}
        <div
          ref={searchRef}
          className="topbar-search"
          style={{ display: 'var(--search-display, flex)' }}
        >
          <Search size={14} color="var(--text-muted)" strokeWidth={2} style={{ flexShrink: 0 }} />
          <input
            placeholder="Search users..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => {}}
            aria-label="Search users"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setSearchedUser(null); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* ── Desktop Nav ── */}
        <nav className="topbar-nav" aria-label="Main navigation">
          {NAV_LINKS.map(({ label, path, icon: Icon }) => (
            <motion.button
              key={path}
              className={`topbar-nav-item ${isActive(path) ? 'active' : ''}`}
              onClick={() => navigate(path)}
              whileTap={{ scale: 0.95 }}
              aria-current={isActive(path) ? 'page' : undefined}
            >
              <Icon size={16} strokeWidth={isActive(path) ? 2.2 : 1.8} />
              <span className="nav-label">{label}</span>
            </motion.button>
          ))}
        </nav>

        {/* ── Actions ── */}
        <div className="topbar-actions">
          {/* Mobile search toggle */}
          <motion.button
            className="topbar-icon-btn mobile-search-toggle"
            onClick={() => setMobileSearchOpen(v => !v)}
            whileTap={{ scale: 0.9 }}
            aria-label="Search"
            style={{ display: 'none' }} // shown via CSS at ≤768px
          >
            <Search size={16} />
          </motion.button>

          {/* Theme toggle */}
          <motion.button
            className="topbar-icon-btn"
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Notifications */}
          <motion.button
            className="topbar-icon-btn"
            onClick={() => setNotificationsOpen(v => !v)}
            whileTap={{ scale: 0.9 }}
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="badge" aria-hidden="true" />
          </motion.button>

          {/* Profile avatar */}
          <motion.div
            className="topbar-user"
            onClick={() => navigate(`/profile/${userId}`)}
            whileTap={{ scale: 0.96 }}
            style={{ cursor: 'pointer' }}
            role="button"
            aria-label="View profile"
          >
            {profilePic ? (
              <img src={profilePic} alt={username} onError={e => { e.target.style.display='none'; }} />
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {username[0]?.toUpperCase()}
              </div>
            )}
            <span>{username}</span>
          </motion.div>

          {/* Mobile hamburger */}
          <motion.button
            className="topbar-icon-btn mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(v => !v)}
            whileTap={{ scale: 0.9 }}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
            style={{ display: 'none' }} // shown via CSS
          >
            <AnimatePresence mode="wait">
              <motion.div key={mobileMenuOpen ? 'x' : 'menu'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      {/* ── Mobile search bar (slides down) ── */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            ref={mobileSearchRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 'calc(var(--topbar-h) + var(--safe-top))',
              left: 0, right: 0,
              background: 'var(--bg-card)',
              borderBottom: '1px solid var(--border)',
              padding: '10px 14px',
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Search size={15} color="var(--text-muted)" strokeWidth={2} style={{ flexShrink: 0 }} />
            <input
              autoFocus
              placeholder="Search users..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font)',
              }}
              aria-label="Search users"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setSearchedUser(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                <X size={14} />
              </button>
            )}
            <button onClick={() => setMobileSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600 }}>
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Search result dropdown ── */}
      <SearchDropdown searchedUser={searchedUser} setSearchedUser={setSearchedUser} />

      {/* ── CSS for responsive topbar elements ── */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-search-toggle { display: flex !important; }
          .mobile-menu-toggle   { display: flex !important; }
          .topbar-nav           { display: none !important; }
          .topbar-search        { display: none !important; }
        }
        @media (max-width: 480px) {
          .topbar-icon-btn:not(.mobile-search-toggle):not(.mobile-menu-toggle) {
            /* Hide theme toggle on very small screens, keep notifications */
          }
        }
        @media (max-width: 360px) {
          .topbar-icon-btn.theme-toggle { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Topbar;