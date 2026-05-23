import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, Film, Bookmark, User, Plus } from 'lucide-react';
import { GeneralContext } from '../context/GeneralContextProvider';

const NAV_ITEMS = [
  { id: 'home',    icon: Home,    label: 'Home',    path: '/' },
  { id: 'explore', icon: Compass, label: 'Explore', path: '/explore' },
  { id: 'create',  icon: Plus,    label: null,      path: null },   // center create
  { id: 'reels',   icon: Film,    label: 'Reels',   path: '/reels' },
  { id: 'profile', icon: User,    label: 'Profile', path: '/profile' },
];

const MobileBottomNav = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { setIsCreatePostOpen } = useContext(GeneralContext);

  const userId = localStorage.getItem('userId');

  const isActive = (path) => {
    if (!path) return false;
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handlePress = (item) => {
    if (item.id === 'create') {
      setIsCreatePostOpen(true);
      return;
    }
    if (item.id === 'profile') {
      navigate(`/profile/${userId}`);
      return;
    }
    navigate(item.path);
  };

  return (
    <nav
      className="mobile-bottom-nav"
      role="navigation"
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map((item) => {
        if (item.id === 'create') {
          return (
            <motion.button
              key="create"
              className="mobile-nav-create"
              onClick={() => setIsCreatePostOpen(true)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.88, rotate: 45 }}
              aria-label="Create post"
              style={{ flexShrink: 0 }}
            >
              <Plus size={20} color="#fff" strokeWidth={2.5} />
            </motion.button>
          );
        }

        const active = isActive(item.path);
        const Icon = item.icon;

        return (
          <motion.button
            key={item.id}
            className={`mobile-nav-btn ${active ? 'active' : ''}`}
            onClick={() => handlePress(item)}
            whileTap={{ scale: 0.88 }}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
          >
            {/* Active indicator dot */}
            {active && (
              <motion.div
                layoutId="mobile-nav-dot"
                style={{
                  position: 'absolute',
                  top: 6,
                  width: 4, height: 4,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Icon
              size={22}
              strokeWidth={active ? 2.2 : 1.8}
              fill={active && (item.id === 'home') ? 'var(--accent)' : 'none'}
            />
            {item.label && (
              <span className="mobile-nav-label">{item.label}</span>
            )}
          </motion.button>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;