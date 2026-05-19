import React, { useContext, useEffect, useState } from 'react';
import { GeneralContext } from '../../context/GeneralContextProvider';

const Chats = () => {
  const { socket, chatFirends, setChatFriends, dispatch, chatData } = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    socket.emit('fetch-friends', { userId });
    socket.on('friends-data-fetched', ({ friendsData }) => {
      setChatFriends(friendsData);
    });
  }, []);

  const handleSelect = (data) => {
    dispatch({ type: 'CHANGE_USER', payload: data });
  };

  useEffect(() => {
    if (chatData.chatId !== null) {
      socket.emit('fetch-messages', { chatId: chatData.chatId });
    }
  }, [chatData]);

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      scrollbarWidth: 'none',
    }}>
      {chatFirends.map((data) => {
        const isActive = chatData.user?._id === data._id;
        const isHovered = hovered === data._id;

        return (
          <div
            key={data._id}
            onClick={() => handleSelect(data)}
            onMouseEnter={() => setHovered(data._id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '13px 16px',
              cursor: 'pointer',
              background: isActive
                ? 'rgba(74,123,255,0.1)'
                : isHovered
                ? 'rgba(255,255,255,0.03)'
                : 'transparent',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              borderLeft: isActive
                ? '2px solid #4a7bff'
                : '2px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={data.profilePic}
                alt=""
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: isActive
                    ? '1.5px solid rgba(74,123,255,0.7)'
                    : '1.5px solid rgba(255,255,255,0.08)',
                  transition: 'border-color 0.15s',
                }}
              />
              <span style={{
                position: 'absolute',
                bottom: '1px',
                right: '1px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#3db87a',
                border: '1.5px solid #0f1525',
              }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{
                fontSize: '13.5px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : '#8892aa',
                display: 'block',
                letterSpacing: '0.01em',
                transition: 'color 0.15s',
              }}>
                {data.username}
              </span>
              <span style={{
                fontSize: '11px',
                color: '#3d4a63',
                marginTop: '2px',
                display: 'block',
              }}>
                Tap to open chat
              </span>
            </div>

            {isActive && (
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#4a7bff',
                flexShrink: 0,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Chats;