import { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import './App.css';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import CreatePost from './components/CreatePost';
import Profile from './pages/Profile';
import Notifications from './components/Notifications';
import AuthProtector from './RouteProtectors/AuthProtector';
import LoginProtector from './RouteProtectors/LoginProtector';
import Chat from './pages/Chat';
import CreateStory from './components/CreateStory';
import Explore from './pages/Explore';
import Reels from './pages/Reels';
import Saved from './pages/Saved';
import NeXoraLogo from './components/NeXoraLogo';
import MobileBottomNav from './components/MobileBottomNav';

// Theme applied synchronously at module load
(() => {
  try {
    const t = localStorage.getItem('nexora-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
  } catch { /* SSR guard */ }
})();

/* ── Splash Screen ──────────────────────────────────────────── */
const SplashScreen = ({ onDone }) => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => { setPhase(3); onDone(); }, 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 3 ? 0 : 1 }}
      transition={{ duration: 0.6 }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= 1 ? 1 : 0.7 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <NeXoraLogo large={true} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 10 }}
        transition={{ duration: 0.6 }}
        style={{ fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}
      >
        Connect · Share · Discover
      </motion.p>
      <motion.div
        style={{ position: 'absolute', bottom: 0, left: 0, height: 3, background: 'linear-gradient(90deg, #4F75FF, #8B5CF6, #EC4899)' }}
        initial={{ width: '0%' }}
        animate={{ width: phase >= 1 ? '100%' : '0%' }}
        transition={{ duration: 2.2, ease: 'easeInOut' }}
      />
    </motion.div>
  );
};

/* ── Page transition wrapper ─────────────────────────────────── */
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

/* ── App ─────────────────────────────────────────────────────── */
function App() {
  // eslint-disable-next-line no-unused-vars
  const [splashVisible, setSplashVisible] = useState(true);
  const location = useLocation();

  const handleSplashDone = () => {
    setTimeout(() => setSplashVisible(false), 700);
  };

  return (
    <div className="App">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'var(--font)',
          },
        }}
      />

      {/* Splash */}
      {splashVisible && <SplashScreen onDone={handleSplashDone} />}

      {/* Routes */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path='/' element={
            <AuthProtector>
              <PageTransition><Home /></PageTransition>
            </AuthProtector>
          } />
          <Route path='/landing' element={
            <LoginProtector>
              <PageTransition><LandingPage /></PageTransition>
            </LoginProtector>
          } />
          <Route path='/profile/:id' element={
            <AuthProtector>
              <PageTransition><Profile /></PageTransition>
            </AuthProtector>
          } />
          <Route path='/chat' element={
            <AuthProtector>
              <PageTransition><Chat /></PageTransition>
            </AuthProtector>
          } />
          <Route path='/explore' element={
            <AuthProtector>
              <PageTransition><Explore /></PageTransition>
            </AuthProtector>
          } />
          <Route path='/reels' element={
            <AuthProtector>
              <Reels />
            </AuthProtector>
          } />
          <Route path='/saved' element={
            <AuthProtector>
              <PageTransition><Saved /></PageTransition>
            </AuthProtector>
          } />
        </Routes>
      </AnimatePresence>

      {/* Global Overlays */}
      <CreatePost />
      <CreateStory />
      <Notifications />
      <MobileBottomNav />
    </div>
  );
}

export default App;