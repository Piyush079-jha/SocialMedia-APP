import React, { useContext, useEffect, useState, useCallback } from 'react';
import { GeneralContext } from '../../context/GeneralContextProvider';

const Chats = () => {
  const { socket, chatFirends, setChatFriends, dispatch, chatData } = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    socket.emit('fetch-friends', { userId });

    const handleFriendsFetched = ({ friendsData }) => {
      setChatFriends(friendsData);
    };

    socket.on('friends-data-fetched', handleFriendsFetched);
    return () => socket.off('friends-data-fetched', handleFriendsFetched);
  }, [userId, socket, setChatFriends]);

  const handleSelect = useCallback((data) => {
    dispatch({ type: 'CHANGE_USER', payload: data });
  }, [dispatch]);

  useEffect(() => {
    if (chatData.chatId !== null) {
      socket.emit('fetch-messages', { chatId: chatData.chatId });
    }
  }, [chatData.chatId, socket]);

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
      {chatFirends.length === 0 && (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: '#4a526b',
          fontSize: '13px',
          letterSpacing: '0.02em',
        }}>
          No conversations yet
        </div>
      )}

      {chatFirends.map((data) => {
        const isActive = chatData.user?._id === data._id;
        const isHovered = hovered === data._id;

        return (
          <div
            key={data._id}
            onClick={() => handleSelect(data)}
            onMouseEnter={() => setHovered(data._id)}
            onMouseLeave={() => setHovered(null)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSelect(data)}
            aria-label={`Open chat with ${data.username}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              cursor: 'pointer',
              background: isActive
                ? 'rgba(109,86,255,0.12)'
                : isHovered
                ? 'rgba(255,255,255,0.03)'
                : 'transparent',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              borderLeft: isActive ? '2px solid #6d56ff' : '2px solid transparent',
              transition: 'background 0.15s, border-color 0.15s',
              outline: 'none',
            }}
          >
            {/* Avatar with online badge */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={data.profilePic}
                alt={data.username}
                loading="lazy"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: isActive
                    ? '2px solid rgba(109,86,255,0.8)'
                    : '2px solid rgba(255,255,255,0.06)',
                  transition: 'border-color 0.15s',
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
                border: '2px solid #0c0e1c',
                boxSizing: 'border-box',
              }} />
            </div>

            {/* Name + subtitle */}
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <span style={{
                fontSize: '13.5px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#e8e8ff' : '#8891aa',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                letterSpacing: '0.01em',
                transition: 'color 0.15s',
              }}>
                {data.username}
              </span>
              <span style={{
                fontSize: '11.5px',
                color: '#3a4260',
                marginTop: '2px',
                display: 'block',
              }}>
                Online
              </span>
            </div>

            {/* Active indicator dot */}
            {isActive && (
              <div style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#6d56ff',
                flexShrink: 0,
                boxShadow: '0 0 8px rgba(109,86,255,0.6)',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Chats;