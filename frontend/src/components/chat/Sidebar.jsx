import React from 'react';
import Search from './Search';
import Chats from './Chats';

const Sidebar = () => {
  return (
    <div style={{
      width: '280px',
      flexShrink: 0,
      background: '#0f1525',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>

      {/* Sidebar header */}
      <div style={{
        padding: '18px 16px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#3d4a63',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          Messages
        </span>
      </div>

      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;