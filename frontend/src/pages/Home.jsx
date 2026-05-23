import React, { useContext } from 'react';
import { Image, Video, Mic } from 'lucide-react';
import { GeneralContext } from '../context/GeneralContextProvider';
import Topbar from '../components/Topbar';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import Stories from '../components/Stories';
import Post from '../components/Post';
import Notifications from '../components/Notifications';
import CreatePost from '../components/CreatePost';
import useWindowWidth from '../hooks/useWindowWidth';

/* ── Story / Create Post Input Bar ─────────────────────────────── */
const StoryInputBar = () => {
  const { setIsCreatePostOpen } = useContext(GeneralContext);
  const pic  = localStorage.getItem('profilePic');
  const name = localStorage.getItem('username') || 'friend';

  return (
    <div
      className="story-input-bar"
      onClick={() => setIsCreatePostOpen(true)}
      role="button"
      aria-label="Create a post"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setIsCreatePostOpen(true)}
    >
      {/* Avatar */}
      {pic ? (
        <img
          className="story-input-avatar"
          src={pic}
          alt={name}
          onError={e => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div
          className="story-input-avatar"
          style={{
            background: 'linear-gradient(135deg, var(--accent), #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: '#fff',
          }}
        >
          {name[0]?.toUpperCase()}
        </div>
      )}

      {/* Placeholder text */}
      <span className="story-input-text">
        What's on your mind, {name.split(' ')[0]}?
      </span>

      {/* Quick-action buttons */}
      <div className="story-input-actions">
        <button
          title="Photo"
          aria-label="Add photo"
          onClick={e => { e.stopPropagation(); setIsCreatePostOpen(true); }}
        >
          <Image size={17} />
        </button>
        <button
          title="Video"
          aria-label="Add video"
          onClick={e => { e.stopPropagation(); setIsCreatePostOpen(true); }}
        >
          <Video size={17} />
        </button>
        <button
          title="Audio"
          aria-label="Add audio"
          onClick={e => { e.stopPropagation(); setIsCreatePostOpen(true); }}
        >
          <Mic size={17} />
        </button>
      </div>
    </div>
  );
};

/* ── Home Page ──────────────────────────────────────────────────── */
const Home = () => {
  const width      = useWindowWidth();
  const showLeft   = width > 768;
  const showRight  = width > 1200;

  return (
    <>
      <Topbar />

      <div className="page-layout">
        {/* Left Sidebar — hidden on mobile via CSS + JS */}
        {showLeft && (
          <LeftSidebar className="left-sidebar" />
        )}

        {/* Main Feed */}
        <main>
          <Stories />
          <StoryInputBar />
          <Post />
        </main>

        {/* Right Sidebar — hidden on ≤1200px */}
        {showRight && (
          <RightSidebar className="right-sidebar" />
        )}
      </div>

      {/* Global overlays */}
      <Notifications />
      <CreatePost />
    </>
  );
};

export default Home;