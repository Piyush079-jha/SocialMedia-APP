import React from 'react';
import { useNavigate } from 'react-router-dom';

const Search = ({ searchedUser, setSearchedUser }) => {
  const navigate = useNavigate();

  if (!searchedUser) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '64px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#0f1525',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '8px',
      zIndex: 200,
      minWidth: '240px',
      boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
    }}>
      <div
        onClick={() => { navigate(`/profile/${searchedUser._id}`); setSearchedUser(); }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 12px',
          borderRadius: '10px',
          cursor: 'pointer',
          background: '#151d30',
          border: '1px solid rgba(255,255,255,0.06)',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,123,255,0.1)'}
        onMouseLeave={e => e.currentTarget.style.background = '#151d30'}
      >
        <img
          src={searchedUser.profilePic}
          alt=""
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1.5px solid rgba(74,123,255,0.5)',
          }}
        />
        <div>
          <span style={{
            fontSize: '13.5px',
            color: '#ffffff',
            fontWeight: 500,
            display: 'block',
            letterSpacing: '0.01em',
          }}>
            {searchedUser.username}
          </span>
          <span style={{ fontSize: '11px', color: '#3d4a63' }}>View profile</span>
        </div>
      </div>
    </div>
  );
};

export default Search;