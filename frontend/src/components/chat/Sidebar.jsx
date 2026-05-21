import React, { useContext, useRef, useState } from 'react';
import Search from './Search';
import Chats from './Chats';
import { GeneralContext } from '../../context/GeneralContextProvider';

const Sidebar = () => {
  const { socket } = useContext(GeneralContext);
  const [query, setQuery] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const searchTimeout = useRef(null);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (!val.trim()) {
      setSearchedUser(null);
      return;
    }

    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      socket.emit('find-user', { username: val.trim() });
      socket.once('user-found', ({ userData }) => {
        setSearchedUser(userData || null);
      });
    }, 350);
  };

  const clearSearch = () => {
    setQuery('');
    setSearchedUser(null);
  };

  return (
    <div style={{
      width: '280px',
      minWidth: '220px',
      flexShrink: 0,
      background: '#0f1225',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 16px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#3a4260',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '14px',
        }}>
          Messages
        </span>

        {/* Search bar */}
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '11px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#3a4260',
            fontSize: '14px',
            pointerEvents: 'none',
            lineHeight: 1,
          }}>
            ⌕
          </span>
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={handleSearch}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '10px',
              padding: '8px 34px 8px 30px',
              fontSize: '12.5px',
              color: '#e8e8ff',
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'rgba(109,86,255,0.4)';
              e.target.style.background = 'rgba(109,86,255,0.05)';
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(255,255,255,0.07)';
              e.target.style.background = 'rgba(255,255,255,0.04)';
            }}
          />
          {query && (
            <button
              onClick={clearSearch}
              aria-label="Clear search"
              style={{
                position: 'absolute',
                right: '9px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#3a4260',
                cursor: 'pointer',
                fontSize: '14px',
                lineHeight: 1,
                padding: '2px',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Search dropdown (absolutely positioned) */}
      <Search searchedUser={searchedUser} setSearchedUser={setSearchedUser} />

      {/* Friends list */}
      <Chats />
    </div>
  );
};

export default Sidebar;