import React from 'react';
import Post from '../components/Post';
import HomeLogo from '../components/HomeLogo';
import Navbar from '../components/Navbar';
import Stories from '../components/Stories';

const Home = () => {
  return (
    <div style={{
      background: '#080808',
      minHeight: '100vh',
      paddingTop: 72,   // space for fixed HomeLogo header
      paddingBottom: 72, // space for fixed Navbar footer
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <HomeLogo />
      <Navbar />

      <div style={{ width: '100%', maxWidth: 600, padding: '16px 16px 0' }}>
        <Stories />
        <Post />
      </div>
    </div>
  );
};

export default Home;