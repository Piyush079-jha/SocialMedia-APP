import React, { useContext, useEffect, useRef } from 'react';
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

  const timeStr = date.getHours() === 0
    ? '12:' + String(date.getMinutes()).padStart(2, '0') + ' AM'
    : date.getHours() < 12
    ? date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0') + ' AM'
    : date.getHours() === 12
    ? '12:' + String(date.getMinutes()).padStart(2, '0') + ' PM'
    : (date.getHours() - 12) + ':' + String(date.getMinutes()).padStart(2, '0') + ' PM';

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-end',
        maxWidth: '75%',
        alignSelf: isOwner ? 'flex-end' : 'flex-start',
        flexDirection: isOwner ? 'row-reverse' : 'row',
        animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      <img
        src={isOwner ? (localStorage.getItem('profilePic') || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png') : chatData?.user?.profilePic}
        alt=""
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: isOwner ? '1.5px solid var(--accent, #7c6bff)' : '1.5px solid rgba(255,255,255,0.08)',
          boxShadow: isOwner ? '0 0 10px rgba(124, 107, 255, 0.25)' : 'none',
          flexShrink: 0,
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          alignItems: isOwner ? 'flex-end' : 'flex-start',
        }}
      >
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '20px',
            borderBottomLeftRadius: isOwner ? '20px' : '4px',
            borderBottomRightRadius: isOwner ? '4px' : '20px',
            fontSize: '13.5px',
            lineHeight: 1.6,
            letterSpacing: '0.01em',
            background: isOwner ? 'linear-gradient(135deg, #7c6bff, #5142e6)' : '#16192b',
            border: isOwner ? 'none' : '1px solid rgba(255,255,255,0.08)',
            color: isOwner ? '#ffffff' : '#b2bbd6',
            boxShadow: isOwner ? '0 4px 15px rgba(124, 107, 255, 0.3)' : 'none',
          }}
        >
          {message.text && <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{message.text}</p>}
          {message.file && (
            <img
              src={message.file}
              alt=""
              style={{
                display: 'block',
                maxWidth: '240px',
                maxHeight: '180px',
                borderRadius: '12px',
                marginTop: message.text ? '8px' : 0,
                border: '1px solid rgba(255,255,255,0.1)',
                objectFit: 'cover',
              }}
            />
          )}
        </div>
        <span
          style={{
            fontSize: '10px',
            color: '#55658c',
            padding: '0 6px',
            letterSpacing: '0.02em',
          }}
        >
          {timeStr}
        </span>
      </div>
    </div>
  );
};

export default Message;