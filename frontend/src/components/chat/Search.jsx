import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = ({ searchedUser, setSearchedUser }) => {
  const navigate = useNavigate();
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!searchedUser) return;

    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setSearchedUser(null);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [searchedUser, setSearchedUser]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setSearchedUser(null);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [setSearchedUser]);

  if (!searchedUser) return null;

  const handleNavigate = () => {
    navigate(`/profile/${searchedUser._id}`);
    setSearchedUser(null);
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Search result"
      style={{
        position: 'absolute',
        top: '68px',
        left: '12px',
        right: '12px',
        background: '#121428',
        border: '1px solid rgba(109,86,255,0.2)',
        borderRadius: '14px',
        padding: '8px',
        zIndex: 200,
        boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(109,86,255,0.08)',
        animation: 'dropIn 0.18s ease',
      }}
    >
      <div
        onClick={handleNavigate}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 12px',
          borderRadius: '10px',
          cursor: 'pointer',
          background: 'rgba(109,86,255,0.06)',
          border: '1px solid rgba(109,86,255,0.12)',
          transition: 'background 0.15s',
          outline: 'none',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(109,86,255,0.14)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(109,86,255,0.06)'}
      >
        <img
          src={searchedUser.profilePic}
          alt={searchedUser.username}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1.5px solid rgba(109,86,255,0.5)',
            flexShrink: 0,
          }}
        />
        <div style={{ minWidth: 0 }}>
          <span style={{
            fontSize: '13.5px',
            color: '#e8e8ff',
            fontWeight: 600,
            display: 'block',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {searchedUser.username}
          </span>
          <span style={{
            fontSize: '11.5px',
            color: '#6d56ff',
            marginTop: '1px',
            display: 'block',
          }}>
            View profile →
          </span>
        </div>
      </div>

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Search;