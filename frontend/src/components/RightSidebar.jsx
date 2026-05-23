import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import axios from 'axios';

const MY_COMMUNITIES = [
  { name: 'Rare Flower Inspired', members: '12K member',  color: '#EC4899', emoji: '🌸' },
  { name: 'Home Cactus Plant',    members: '138K member', color: '#10B981', emoji: '🌵' },
  { name: 'Mordern Decor Building',members:'103K member', color: '#F59E0B', emoji: '🏗️' },
];

const RightSidebar = () => {
  const [users, setUsers] = useState([]);
  const [showAd, setShowAd] = useState(true);
  const myId = localStorage.getItem('userId');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('http://localhost:6001/fetchAllUsers');
        setUsers((data ?? []).filter(u => u._id !== myId).slice(0, 8));
      } catch { /* silent */ }
    };
    load();
  }, [myId]);

  return (
    <aside className="right-sidebar sidebar-sticky">
      {/* Active Friends */}
      <div className="sidebar-block">
        <div className="sidebar-block-header">
          <span className="sidebar-block-title">Active Friends</span>
          <div className="sidebar-block-more"><span /><span /><span /></div>
        </div>
        <div className="friends-grid">
          {users.length === 0
            ? Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="friend-avatar">
                  <div className="avatar-placeholder" style={{ width: '100%', aspectRatio: 1, borderRadius: '50%', background: `hsl(${i * 45},60%,55%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', border: '2px solid var(--bg-card)' }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div className="friend-online-dot" />
                </div>
              ))
            : users.map((u, i) => (
                <div key={u._id} className="friend-avatar">
                  {u.profilePic ? (
                    <img src={u.profilePic} alt={u.username} onError={e => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="avatar-placeholder" style={{ width: '100%', aspectRatio: 1, borderRadius: '50%', background: `hsl(${i * 45},60%,55%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', border: '2px solid var(--bg-card)' }}>
                      {u.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="friend-online-dot" style={{ background: i % 3 === 0 ? '#F59E0B' : '#3DC98B' }} />
                </div>
              ))
          }
        </div>
        <button className="see-all-btn">See All +</button>
      </div>

      {/* Ads Platform */}
      {showAd && (
        <div className="sidebar-block">
          <div className="sidebar-block-header">
            <span className="sidebar-block-title">Ads Platform</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAd(false)}
              style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font)' }}
            >
              <X size={12} /> Close
            </motion.button>
          </div>
          <div className="ads-card">
            <img src="https://picsum.photos/seed/airpods/300/120" alt="ad" />
            <button className="ads-card-close" onClick={() => setShowAd(false)}>✕</button>
            <div className="ads-price">$99</div>
          </div>
          <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>Premium wireless earbuds. Limited time offer!</p>
        </div>
      )}

      {/* My Community */}
      <div className="sidebar-block">
        <div className="sidebar-block-header">
          <span className="sidebar-block-title">My Community</span>
          <div className="sidebar-block-more"><span /><span /><span /></div>
        </div>
        {MY_COMMUNITIES.map((c, i) => (
          <div key={c.name} className="community-item">
            <div
              className="community-img"
              style={{ background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, borderRadius: 12 }}
            >
              {c.emoji}
            </div>
            <div className="community-info">
              <div className="community-name">{c.name}</div>
              <div className="community-members">{c.members}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[0,1,2].map(j => <div key={j} style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-muted)' }} />)}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default RightSidebar;
