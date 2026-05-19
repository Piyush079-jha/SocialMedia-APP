import React, { useContext, useEffect, useRef } from 'react'
import { GeneralContext } from '../../context/GeneralContextProvider';

const Message = ({ message }) => {

  const { chatData } = useContext(GeneralContext);
  const ref = useRef();
  const date = new Date(message.date);
  const userId = localStorage.getItem('userId');
  const isOwner = message.senderId === userId;

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  const timeStr = date.getHours() < 12
    ? date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0') + ' AM'
    : (date.getHours() - 12) + ':' + String(date.getMinutes()).padStart(2, '0') + ' PM';

  return (
    <div ref={ref} style={{
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-end',
      maxWidth: '72%',
      alignSelf: isOwner ? 'flex-end' : 'flex-start',
      flexDirection: isOwner ? 'row-reverse' : 'row',
    }}>

      {/* Avatar */}
      <img
        src={isOwner ? localStorage.getItem('profilePic') : chatData.user.profilePic}
        alt=""
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: isOwner
            ? '1.5px solid rgba(74,123,255,0.7)'
            : '1.5px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
        }}
      />

      {/* Bubble + time */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        alignItems: isOwner ? 'flex-end' : 'flex-start',
      }}>
        <div style={{
          padding: '11px 16px',
          borderRadius: '18px',
          borderBottomLeftRadius: isOwner ? '18px' : '4px',
          borderBottomRightRadius: isOwner ? '4px' : '18px',
          fontSize: '13.5px',
          lineHeight: 1.6,
          letterSpacing: '0.01em',
          background: isOwner
            ? 'linear-gradient(135deg, #4a7bff, #2d5ce8)'
            : '#0f1525',
          border: isOwner
            ? 'none'
            : '1px solid rgba(255,255,255,0.06)',
          color: isOwner ? '#ffffff' : '#8892aa',
          boxShadow: isOwner
            ? '0 4px 20px rgba(74,123,255,0.25)'
            : 'none',
        }}>
          {message.text && <p style={{ margin: 0 }}>{message.text}</p>}
          {message.file && (
            <img
              src={message.file}
              alt=""
              style={{
                display: 'block',
                maxWidth: '220px',
                borderRadius: '10px',
                marginTop: message.text ? '8px' : 0,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
          )}
        </div>

        <span style={{
          fontSize: '10px',
          color: '#3d4a63',
          padding: '0 4px',
          letterSpacing: '0.02em',
        }}>
          {timeStr}
        </span>
      </div>
    </div>
  );
};

export default Message;