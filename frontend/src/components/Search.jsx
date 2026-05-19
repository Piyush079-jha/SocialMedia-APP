import React from 'react';
import { useNavigate } from 'react-router-dom';

const C = {
  cardBg:    '#0f1525',
  elevated:  '#151d30',
  textPrim:  '#ffffff',
  textSec:   '#8892aa',
  textMuted: '#3d4a63',
  borderHov: 'rgba(255,255,255,0.12)',
  borderDef: 'rgba(255,255,255,0.06)',
  borderAcc: 'rgba(74,123,255,0.5)',
};

const Search = ({ searchedUser, setSearchedUser }) => {
  const navigate = useNavigate();

  if (!searchedUser) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '66px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: C.cardBg,
      border: `1px solid ${C.borderHov}`,
      borderRadius: '14px',
      padding: '8px',
      zIndex: 200,
      minWidth: '240px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
    }}>
      <div
        onClick={() => { navigate(`/profile/${searchedUser._id}`); setSearchedUser(); }}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '11px 13px',
          borderRadius: '10px', cursor: 'pointer',
          background: C.elevated,
          border: `1px solid ${C.borderDef}`,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,123,255,0.1)'}
        onMouseLeave={e => e.currentTarget.style.background = C.elevated}
      >
        <img
          src={searchedUser.profilePic} alt=""
          style={{
            width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover',
            border: '1.5px solid rgba(74,123,255,0.5)',
          }}
        />
        <div>
          <span style={{ fontSize: '13.5px', color: C.textPrim, fontWeight: 600, display: 'block' }}>
            {searchedUser.username}
          </span>
          <span style={{ fontSize: '11px', color: C.textMuted }}>View profile</span>
        </div>
      </div>
    </div>
  );
};

export default Search;