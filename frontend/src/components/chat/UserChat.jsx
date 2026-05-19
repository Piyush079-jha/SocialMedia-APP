import React, { useContext } from 'react'
import Input from './Input';
import Messages from './Messages';
import { GeneralContext } from '../../context/GeneralContextProvider';

const UserChat = () => {

  const { chatData } = useContext(GeneralContext);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#0a0e1a',
    }}>

      {/* Header */}
      {chatData.user && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '13px',
          padding: '16px 20px',
          background: '#0f1525',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{ position: 'relative' }}>
            <img
              src={chatData.user?.profilePic}
              alt=""
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid rgba(74,123,255,0.5)',
              }}
            />
            {/* Online dot */}
            <span style={{
              position: 'absolute',
              bottom: '1px',
              right: '1px',
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: '#3db87a',
              border: '1.5px solid #0f1525',
            }} />
          </div>

          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#ffffff',
              letterSpacing: '0.01em',
            }}>
              {chatData.user.username}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#3db87a',
              marginTop: '2px',
              letterSpacing: '0.02em',
            }}>
              Online
            </div>
          </div>
        </div>
      )}

      <Messages />
      <Input />
    </div>
  );
};

export default UserChat;