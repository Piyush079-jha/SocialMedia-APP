// Search.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const C = {
  cardBg:    '#0f1525',
  elevated:  '#151d30',
  textPrim:  '#ffffff',
  textSec:   '#8892aa',
  textMuted: '#3d4a63',
  borderHov: 'rgba(255,255,255,0.12)',
  borderDef: 'rgba(255,255,255,0.06)',
};

const Search = ({ searchedUser, setSearchedUser }) => {
  const navigate  = useNavigate();
  const containerRef = useRef(null);

  // Outside-click dismissal
  useEffect(() => {
    if (!searchedUser) return;
    const handleMouseDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSearchedUser(null);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [searchedUser, setSearchedUser]);

  // Escape key dismissal
  useEffect(() => {
    if (!searchedUser) return;
    const handleKey = (e) => { if (e.key === 'Escape') setSearchedUser(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [searchedUser, setSearchedUser]);

  if (!searchedUser) return null;

  const handleSelect = () => {
    navigate(`/profile/${searchedUser._id}`);
    setSearchedUser(null);
  };

  return (
    <>
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
      <div
        ref={containerRef}
        role="listbox"
        aria-label="Search results"
        style={{
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
          animation: 'dropIn 0.18s ease forwards',
        }}
      >
        <div
          role="option"
            aria-selected={false}
          tabIndex={0}
          onClick={handleSelect}
          onKeyDown={(e) => e.key === 'Enter' && handleSelect()}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '11px 13px',
            borderRadius: '10px', cursor: 'pointer',
            background: C.elevated,
            border: `1px solid ${C.borderDef}`,
            transition: 'background 0.15s',
            outline: 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,123,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = C.elevated}
          onFocus={e => e.currentTarget.style.background = 'rgba(74,123,255,0.1)'}
          onBlur={e => e.currentTarget.style.background = C.elevated}
        >
          <img
            src={searchedUser.profilePic}
            alt={searchedUser.username}
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
    </>
  );
};

export default Search;