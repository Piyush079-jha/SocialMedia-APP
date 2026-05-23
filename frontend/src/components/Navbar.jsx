import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, Film, User, Plus } from 'lucide-react';
import { GeneralContext } from '../context/GeneralContextProvider';

const NAV_ITEMS = [
  { id: 'home',    icon: Home,    path: '/' },
  { id: 'explore', icon: Compass, path: '/explore' },
  { id: 'center',  icon: Plus,    path: null }, // center create button
  { id: 'reels',   icon: Film,    path: '/reels' },
  { id: 'profile', icon: User,    path: '/profile' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsCreatePostOpen } = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="nx-navbar">
      {NAV_ITEMS.map((item) => {
        if (item.id === 'center') {
          return (
            <motion.button
              key="center"
              className="nx-nav-center-btn"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9, rotate: 45 }}
              onClick={() => setIsCreatePostOpen(true)}
              title="Create post"
            >
              <Plus size={22} color="#fff" strokeWidth={2.5} />
            </motion.button>
          );
        }

        const active = isActive(item.path);
        const Icon = item.icon;

        return (
          <motion.button
            key={item.id}
            className={`nx-nav-item ${active ? 'active' : ''}`}
            whileTap={{ scale: 0.85 }}
            onClick={() => {
              if (item.id === 'profile') {
                navigate(`/profile/${userId}`);
              } else {
                navigate(item.path);
              }
            }}
            title={item.id}
          >
            <Icon
              size={22}
              strokeWidth={active ? 2.2 : 1.8}
              fill={active && item.id === 'home' ? 'var(--accent)' : 'none'}
            />
          </motion.button>
        );
      })}
    </nav>
  );
};

export default Navbar;