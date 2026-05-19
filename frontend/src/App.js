import { useState, useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
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

const TARGET = ['N', 'e', 'X', 'o', 'r', 'a'];

function playSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.3);
    master.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1.5);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 3.8);
    master.connect(ctx.destination);

    const drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.setValueAtTime(55, ctx.currentTime);
    drone.frequency.linearRampToValueAtTime(58, ctx.currentTime + 2);
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.5;
    drone.connect(droneGain);
    droneGain.connect(master);
    drone.start(ctx.currentTime);
    drone.stop(ctx.currentTime + 4);

    const shimmer = ctx.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(220, ctx.currentTime + 0.4);
    shimmer.frequency.linearRampToValueAtTime(440, ctx.currentTime + 1.8);
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(0, ctx.currentTime + 0.4);
    shimmerGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.9);
    shimmerGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3.2);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(master);
    shimmer.start(ctx.currentTime + 0.4);
    shimmer.stop(ctx.currentTime + 4);

    const ping = ctx.createOscillator();
    ping.type = 'sine';
    ping.frequency.setValueAtTime(880, ctx.currentTime + 1.0);
    ping.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 1.4);
    const pingGain = ctx.createGain();
    pingGain.gain.setValueAtTime(0, ctx.currentTime + 1.0);
    pingGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 1.05);
    pingGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
    ping.connect(pingGain);
    pingGain.connect(master);
    ping.start(ctx.currentTime + 1.0);
    ping.stop(ctx.currentTime + 2.5);

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 800;
    noiseFilter.Q.value = 0.5;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, ctx.currentTime);
    noiseGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.3);
    noiseGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + 2);

    const outro = ctx.createOscillator();
    outro.type = 'sine';
    outro.frequency.setValueAtTime(110, ctx.currentTime + 2.8);
    outro.frequency.linearRampToValueAtTime(55, ctx.currentTime + 3.8);
    const outroGain = ctx.createGain();
    outroGain.gain.setValueAtTime(0, ctx.currentTime + 2.8);
    outroGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 3.0);
    outroGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3.8);
    outro.connect(outroGain);
    outroGain.connect(master);
    outro.start(ctx.currentTime + 2.8);
    outro.stop(ctx.currentTime + 4);

  } catch (e) {
    console.log('Audio not supported');
  }
}

function SplashScreen() {
  const containerRef = useRef();
  const letterRefs = useRef([]);
  const tagRef = useRef();
  const progRef = useRef();
  const lineRef = useRef();
  const tlRef = useRef();
  const trRef = useRef();
  const blRef = useRef();
  const brRef = useRef();

  useEffect(() => {
    playSound();

    const tl = tlRef.current;
    const tr = trRef.current;
    const bl = blRef.current;
    const br = brRef.current;
    const line = lineRef.current;
    const tag = tagRef.current;
    const prog = progRef.current;
    const container = containerRef.current;

    setTimeout(() => {
      [tl, tr, bl, br].forEach(el => {
        if (el) {
          el.style.transition = 'opacity 0.3s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)';
          el.style.opacity = '1';
          el.style.transform = 'scale(1)';
        }
      });
    }, 100);

    setTimeout(() => {
      if (line) {
        line.style.transition = 'width 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease';
        line.style.opacity = '1';
        line.style.width = '60%';
      }
    }, 400);

    TARGET.forEach((char, i) => {
      setTimeout(() => {
        const el = letterRefs.current[i];
        if (el) {
          el.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0px)';
          el.style.textShadow = char === 'X'
            ? '0 0 40px rgba(178,211,230,0.9)'   // Ice blue #B2D3E6 glow
            : '0 0 40px rgba(255,255,255,0.6)';   // White glow for other letters
          setTimeout(() => {
            if (el) el.style.textShadow = '0 0 0px rgba(255,255,255,0)';
          }, 500);
        }
      }, 800 + i * 100);
    });

    setTimeout(() => {
      const xEl = letterRefs.current[2];
      if (xEl) {
        xEl.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), text-shadow 0.4s ease';
        xEl.style.transform = 'translateY(0px) scale(1.15)';
        xEl.style.textShadow = '0 0 60px rgba(178,211,230,1)'; // Ice blue #B2D3E6 full glow
        setTimeout(() => {
          if (xEl) {
            xEl.style.transform = 'translateY(0px) scale(1)';
            xEl.style.textShadow = 'none';
          }
        }, 400);
      }
    }, 1100);

    setTimeout(() => {
      if (tag) {
        tag.style.transition = 'opacity 1.2s ease, letter-spacing 1.2s cubic-bezier(0.16,1,0.3,1), color 1.2s ease';
        tag.style.opacity = '1';
        tag.style.color = 'rgba(255,255,255,0.28)'; // White #FFFFFF at 28% opacity
        tag.style.letterSpacing = '0.38em';
      }
    }, 1600);

    setTimeout(() => {
      if (prog) {
        prog.style.transition = 'width 2.8s cubic-bezier(0.4,0,0.1,1)';
        prog.style.width = '100%';
      }
    }, 300);

    setTimeout(() => {
      if (container) {
        container.style.transition = 'opacity 1s cubic-bezier(0.4,0,0.2,1)';
        container.style.opacity = '0';
      }
    }, 3400);

  }, []);

  const letterStyle = (char) => ({
    display: 'inline-block',
    fontSize: 80,
    fontWeight: char === 'X' ? 700 : 200,
    color: char === 'X' ? '#B2D3E6' : '#FFFFFF', // Ice blue for X, White for rest
    letterSpacing: '-2px',
    opacity: 0,
    transform: 'translateY(30px)',
    minWidth: char === 'X' ? 54 : 46,
    textAlign: 'center',
    transition: 'text-shadow 0.4s ease',
  });

  const cornerBase = {
    position: 'absolute',
    width: 14,
    height: 14,
    opacity: 0,
    transform: 'scale(0.6)',
  };

  // Palette color: Borders Default #1F1F1F used as white-tint overlay
  const cornerBorder = '0.5px solid rgba(255,255,255,0.25)';

  return (
    <div ref={containerRef} style={{
      position: 'fixed', inset: 0,
      background: '#080812', // FIXED: now matches palette Splash bg #080812
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, overflow: 'hidden',
      fontFamily: '"Helvetica Neue", -apple-system, sans-serif',
    }}>

      {/* Corner brackets — white at 25% opacity */}
      <div ref={tlRef} style={{ ...cornerBase, top: 36, left: 36, borderTop: cornerBorder, borderLeft: cornerBorder }} />
      <div ref={trRef} style={{ ...cornerBase, top: 36, right: 36, borderTop: cornerBorder, borderRight: cornerBorder }} />
      <div ref={blRef} style={{ ...cornerBase, bottom: 36, left: 36, borderBottom: cornerBorder, borderLeft: cornerBorder }} />
      <div ref={brRef} style={{ ...cornerBase, bottom: 36, right: 36, borderBottom: cornerBorder, borderRight: cornerBorder }} />

      {/* Center decorative line — white at 8% opacity */}
      <div ref={lineRef} style={{
        position: 'absolute',
        top: '42%',
        left: '50%',
        transform: 'translateX(-50%)',
        height: '0.5px',
        background: 'rgba(255,255,255,0.08)',
        width: 0,
        opacity: 0,
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          {TARGET.map((char, i) => (
            <span
              key={i}
              ref={el => letterRefs.current[i] = el}
              style={letterStyle(char)}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Tagline — White #FFFFFF fades in at 28% opacity */}
        <div ref={tagRef} style={{
          fontSize: 9.5,
          fontWeight: 300,
          color: 'rgba(255,255,255,0)',
          letterSpacing: '0.65em',
          textTransform: 'uppercase',
          opacity: 0,
          transition: 'text-shadow 0.4s ease',
        }}>
          connect &nbsp;·&nbsp; share &nbsp;·&nbsp; grow
        </div>
      </div>

      {/* Progress bar — Ice blue #B2D3E6 at 50% opacity */}
      <div ref={progRef} style={{
        position: 'absolute', bottom: 0, left: 0,
        height: '1px',
        background: 'rgba(178,211,230,0.5)', // #B2D3E6 at 50%
        width: 0,
        borderRadius: '0 1px 1px 0',
      }} />

    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {showSplash && <SplashScreen />}

      <Routes>
        <Route exact path='/' element={<AuthProtector><Home /></AuthProtector>} />
        <Route path='/landing' element={<LoginProtector><LandingPage /></LoginProtector>} />
        <Route path='/profile/:id' element={<AuthProtector><Profile /></AuthProtector>} />
        <Route path='/chat' element={<AuthProtector><Chat /></AuthProtector>} />
      </Routes>

      <CreatePost />
      <CreateStory />
      <Notifications />
    </div>
  );
}

export default App;