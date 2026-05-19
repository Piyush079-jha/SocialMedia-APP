import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/chat/Sidebar';
import UserChat from '../components/chat/UserChat';

const Chat = () => {
  return (
    <div style={{
      background: '#080808',
      minHeight: '100vh',
      paddingBottom: 72, // space for fixed Navbar
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Navbar />

      <div style={{
        display: 'flex',
        flex: 1,
        height: 'calc(100vh - 72px)',
        gap: 0,
      }}>
        <Sidebar />
        <UserChat />
      </div>
    </div>
  );
};

export default Chat;