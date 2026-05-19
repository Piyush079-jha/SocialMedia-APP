import React, { useContext, useState } from 'react';
import { BiHomeAlt } from "react-icons/bi";
import { BsChatSquareText } from "react-icons/bs";
import { CgAddR } from "react-icons/cg";
import { TbNotification } from "react-icons/tb";
import { GeneralContext } from '../context/GeneralContextProvider';
import { useNavigate } from 'react-router-dom';

const C = {
  pageBg:   '#080808',
  cardBg:   '#111111',
  elevated: '#1a1a1a',
  iceBlue:  '#B2D3E6',
  midBlue:  '#8FBCD4',
  textSec:  '#A0A0A0',
  borderDef:'#1F1F1F',
  borderHov:'#2A2A2A',
};

const Navbar = () => {
  const { isCreatPostOpen, setIsCreatePostOpen, setIsCreateStoryOpen, isNotificationsOpen, setNotificationsOpen } = useContext(GeneralContext);
  const navigate = useNavigate();
  const profilePic = localStorage.getItem('profilePic');
  const userId = localStorage.getItem('userId');
  const [hovered, setHovered] = useState(null);

  const iconStyle = (key) => ({
    fontSize: 22,
    color: hovered === key ? C.iceBlue : C.textSec,
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    padding: 10,
    borderRadius: 8,
    background: hovered === key ? 'rgba(178,211,230,0.06)' : 'transparent',
  });

  return (
    <div style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      background: 'rgba(8,8,8,0.92)',
      backdropFilter: 'blur(12px)',
      borderTop: `0.5px solid ${C.borderDef}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '8px 0',
      zIndex: 100,
    }}>
      <BiHomeAlt
        style={iconStyle('home')}
        onMouseEnter={() => setHovered('home')}
        onMouseLeave={() => setHovered(null)}
        onClick={() => navigate('/')}
      />
      <BsChatSquareText
        style={iconStyle('chat')}
        onMouseEnter={() => setHovered('chat')}
        onMouseLeave={() => setHovered(null)}
        onClick={() => navigate('/chat')}
      />
      <CgAddR
        style={iconStyle('create')}
        onMouseEnter={() => setHovered('create')}
        onMouseLeave={() => setHovered(null)}
        onClick={() => { setIsCreatePostOpen(!isCreatPostOpen); setIsCreateStoryOpen(false); }}
      />
      <TbNotification
        style={iconStyle('notify')}
        onMouseEnter={() => setHovered('notify')}
        onMouseLeave={() => setHovered(null)}
        onClick={() => setNotificationsOpen(!isNotificationsOpen)}
      />
      <img
        src={profilePic}
        alt=""
        onMouseEnter={() => setHovered('profile')}
        onMouseLeave={() => setHovered(null)}
        onClick={() => navigate(`/profile/${userId}`)}
        style={{
          width: 32, height: 32,
          borderRadius: '50%',
          objectFit: 'cover',
          cursor: 'pointer',
          border: `1.5px solid ${hovered === 'profile' ? C.iceBlue : C.borderHov}`,
          transition: 'border-color 0.2s ease',
        }}
      />
    </div>
  );
};

export default Navbar;