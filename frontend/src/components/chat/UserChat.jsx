import React, { useContext } from 'react';
import Input from './Input';
import Messages from './Messages';
import { GeneralContext } from '../../context/GeneralContextProvider';

const EmptyState = () => (
  <div style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    background: '#0c0e1c',
    color: '#3a4260',
    userSelect: 'none',
  }}>
    <div style={{
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      background: 'rgba(109,86,255,0.07)',
      border: '1.5px solid rgba(109,86,255,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
    }}>
      💬
    </div>
    <div style={{ textAlign: 'center' }}>
      <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#5a6280', fontWeight: 500 }}>
        No chat selected
      </p>
      <p style={{ margin: 0, fontSize: '12.5px', color: '#3a4260' }}>
        Pick a conversation from the sidebar
      </p>
    </div>
  </div>
);

const UserChat = () => {
  const { chatData } = useContext(GeneralContext);

  if (!chatData.user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0c0e1c' }}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#0c0e1c',
      minWidth: 0,
    }}>
      {/* Chat header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '13px',
        padding: '14px 20px',
        background: '#0f1225',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={chatData.user.profilePic}
            alt={chatData.user.username}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(109,86,255,0.5)',
              display: 'block',
            }}
          />
          <span style={{
            position: 'absolute',
            bottom: '1px',
            right: '1px',
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            background: '#3de8a0',
            border: '2px solid #0f1225',
            boxSizing: 'border-box',
          }} />
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#e8e8ff',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {chatData.user.username}
          </div>
          <div style={{
            fontSize: '11.5px',
            color: '#3de8a0',
            marginTop: '2px',
            letterSpacing: '0.02em',
          }}>
            Active now
          </div>
        </div>

        {/* Actions placeholder */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          {[
            { label: 'Voice call', icon: '📞' },
            { label: 'Video call', icon: '🎥' },
          ].map(({ label, icon }) => (
            <button
              key={label}
              aria-label={label}
              title={label}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#5a6280',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(109,86,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(109,86,255,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <Messages />
      <Input />
    </div>
  );
};

export default UserChat;