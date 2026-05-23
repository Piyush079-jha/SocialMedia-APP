import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, UserPlus, MessageCircle, Bell, BellOff } from 'lucide-react';
import { GeneralContext } from '../context/GeneralContextProvider';

const MOCK = [
  { _id: 'm1', type: 'like',    senderName: 'alex_dev',     message: 'liked your photo',            time: '2m',  read: false },
  { _id: 'm2', type: 'follow',  senderName: 'zara.design',  message: 'started following you',       time: '15m', read: false },
  { _id: 'm3', type: 'comment', senderName: 'coder_pi',     message: 'commented: "Love this! 🔥"',  time: '1h',  read: true  },
  { _id: 'm4', type: 'like',    senderName: 'nova_studios', message: 'liked your video',            time: '3h',  read: true  },
  { _id: 'm5', type: 'follow',  senderName: 'art_world',    message: 'started following you',       time: '5h',  read: true  },
];

const TYPE_CFG = {
  like:    { icon: Heart,         color: '#FF5B5B',  bg: 'rgba(255,91,91,0.12)' },
  follow:  { icon: UserPlus,      color: '#4F75FF',  bg: 'rgba(79,117,255,0.12)' },
  comment: { icon: MessageCircle, color: '#3DC98B',  bg: 'rgba(61,201,139,0.12)' },
};

const Notifications = () => {
  const { socket, isNotificationsOpen, setNotificationsOpen } = useContext(GeneralContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!isNotificationsOpen) return;
    socket.emit('fetch-notifications', { userId: localStorage.getItem('userId') });
    const handler = ({ notifications }) => setNotifications(notifications ?? []);
    socket.on('user-notifications', handler);
    return () => socket.off('user-notifications', handler);
  }, [isNotificationsOpen, socket]);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') setNotificationsOpen(false); };
    if (isNotificationsOpen) window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isNotificationsOpen, setNotificationsOpen]);

  const displayed = notifications.length > 0 ? notifications : MOCK;
  const unread = displayed.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isNotificationsOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setNotificationsOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 799 }}
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="notif-panel"
          >
            {/* Header */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={15} color="var(--accent)" />
                </div>
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Notifications</h2>
                  {unread > 0 && <p style={{ fontSize: 11, color: 'var(--accent)', margin: 0 }}>{unread} new</p>}
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setNotificationsOpen(false)}
                style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={13} />
              </motion.button>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {displayed.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 20px' }}>
                  <BellOff size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px', display: 'block' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>You're all caught up!</p>
                </div>
              ) : (
                displayed.map((n, i) => {
                  const cfg = TYPE_CFG[n.type] || TYPE_CFG.like;
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={n._id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px',
                        background: n.read ? 'transparent' : 'rgba(79,117,255,0.04)',
                        cursor: 'pointer', transition: 'background 0.15s',
                        borderLeft: n.read ? '3px solid transparent' : '3px solid var(--accent)',
                      }}
                      whileHover={{ background: 'var(--bg-elevated)' }}
                    >
                      {/* Avatar */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${cfg.color}22` }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: cfg.color }}>
                            {n.senderName?.[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-card)' }}>
                          <Icon size={8} color={cfg.color} fill={n.type === 'like' ? cfg.color : 'none'} />
                        </div>
                      </div>
                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{n.senderName} </span>
                          {n.message}
                        </p>
                        {n.time && <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>{n.time} ago</p>}
                      </div>
                      {!n.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />}
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
              <button style={{ width: '100%', background: 'none', border: 'none', fontSize: 13, color: 'var(--accent)', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font)' }}>
                Mark all as read
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Notifications;