import React, { useContext, useEffect, useState } from 'react';
import { TbSearch } from 'react-icons/tb';
import { GeneralContext } from '../context/GeneralContextProvider';
import Search from './Search';

const C = {
  pageBg:    '#0a0e1a',
  cardBg:    '#0f1525',
  elevated:  '#151d30',
  textPrim:  '#ffffff',
  textSec:   '#8892aa',
  blue:      '#4a7bff',
  borderDef: 'rgba(255,255,255,0.06)',
  borderAcc: 'rgba(74,123,255,0.5)',
};

const HomeLogo = () => {
  const { socket } = useContext(GeneralContext);
  const [search, setSearch] = useState('');
  const [searchedUser, setSearchedUser] = useState();
  const [focused, setFocused] = useState(false);

  const handleSearch = async () => {
    await socket.emit('user-search', { username: search });
    setSearch('');
  };

  useEffect(() => {
    socket.on('searched-user', ({ user }) => setSearchedUser(user));
  }, [socket]);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      background: 'rgba(10,14,26,0.88)',
      backdropFilter: 'blur(14px)',
      borderBottom: `1px solid ${C.borderDef}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px',
      height: '58px',
      zIndex: 100,
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
        <span style={{ fontSize: '20px', fontWeight: 700, color: '#4a7bff', letterSpacing: '-0.5px' }}>Ne</span>
        <span style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.5px' }}>Xora</span>
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center',
        background: C.elevated,
        border: `1px solid ${focused ? C.borderAcc : C.borderDef}`,
        borderRadius: '10px',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
        width: '230px',
      }}>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={{
            background: 'transparent', border: 'none', outline: 'none',
            color: C.textPrim, fontSize: '13px',
            padding: '9px 13px', flex: 1, fontFamily: 'inherit',
          }}
        />
        <div
          onClick={handleSearch}
          style={{
            padding: '9px 13px', color: focused ? C.blue : C.textSec,
            cursor: 'pointer', fontSize: '16px',
            display: 'flex', alignItems: 'center',
            transition: 'color 0.2s',
          }}
        >
          <TbSearch />
        </div>
      </div>

      <Search searchedUser={searchedUser} setSearchedUser={setSearchedUser} />
    </div>
  );
};

export default HomeLogo;