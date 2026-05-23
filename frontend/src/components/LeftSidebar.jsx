import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const COMMUNITIES = [
  { name: 'Camero Shoot',       members: '12K member', color: '#4F75FF' },
  { name: 'Coffe Lovers',       members: '12K member', color: '#F59E0B' },
  { name: '3D Art Designer',    members: '12K member', color: '#8B5CF6' },
  { name: 'Illustration Tips',  members: '12K member', color: '#EC4899' },
  { name: 'NFT Collector',      members: '12K member', color: '#06B6D4' },
];

const VIEWED_SEEDS = [10, 25, 42, 63, 80, 97];

const LeftSidebar = () => {
  const [joined, setJoined] = useState([]);

  return (
    <aside className="left-sidebar sidebar-sticky">
      {/* Join Community */}
      <div className="sidebar-block">
        <div className="sidebar-block-header">
          <span className="sidebar-block-title">Join Community</span>
          <div className="sidebar-block-more">
            <span /><span /><span />
          </div>
        </div>

        {COMMUNITIES.map((c, i) => (
          <motion.div
            key={c.name}
            className="community-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div
              className="community-img"
              style={{ background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span style={{ fontSize: 18 }}>
                {['📸','☕','🎨','✏️','🖼️'][i]}
              </span>
            </div>
            <div className="community-info">
              <div className="community-name">{c.name}</div>
              <div className="community-members">{c.members}</div>
            </div>
            <motion.button
              className="community-join-btn"
              whileTap={{ scale: 0.85 }}
              onClick={() => setJoined(prev =>
                prev.includes(c.name) ? prev.filter(n => n !== c.name) : [...prev, c.name]
              )}
              style={joined.includes(c.name) ? { background: 'var(--accent)', color: '#fff' } : {}}
            >
              {joined.includes(c.name) ? '✓' : <Plus size={13} />}
            </motion.button>
          </motion.div>
        ))}

        <button className="see-all-btn">See All +</button>
      </div>

      {/* Recently Viewed */}
      <div className="sidebar-block">
        <div className="sidebar-block-header">
          <span className="sidebar-block-title">Recently Viewed</span>
          <div className="sidebar-block-more"><span /><span /><span /></div>
        </div>
        <div className="viewed-grid">
          {VIEWED_SEEDS.map(seed => (
            <img
              key={seed}
              src={`https://picsum.photos/seed/${seed}/80/80`}
              alt=""
              className="viewed-img"
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
