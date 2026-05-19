import React, { useState } from 'react';
import socialeXLogo from '../images/SocialeX.png';
import About1 from '../images/about-1.png';
import About2 from '../images/about-2.jpg';
import Login from '../components/Login';
import Register from '../components/Register';

// NeXora Palette
const C = {
  pageBg:    '#080808',
  cardBg:    '#111111',
  elevated:  '#1a1a1a',
  textPrim:  '#FFFFFF',
  textSec:   '#A0A0A0',
  textMuted: '#6E6E6E',
  iceBlue:   '#B2D3E6',
  midBlue:   '#8FBCD4',
  deepBlue:  '#1A3A4A',
  borderDef: '#1F1F1F',
  borderHov: '#2A2A2A',
  borderAcc: '#B2D3E6',
};

const LandingPage = () => {
  const [isLoginBox, setIsLoginBox] = useState(true);
  const [hoveredNav, setHoveredNav] = useState(null);

  return (
    <div style={{ background: C.pageBg, minHeight: '100vh', fontFamily: '"Helvetica Neue", -apple-system, sans-serif', color: C.textPrim }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(8,8,8,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: `0.5px solid ${C.borderDef}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 60,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: C.iceBlue, letterSpacing: '-0.5px' }}>Ne</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: C.textPrim, letterSpacing: '-0.5px' }}>Xora</span>
        </div>
        <ul style={{ display: 'flex', gap: 32, listStyle: 'none', margin: 0, padding: 0 }}>
          {['Home', 'About', 'Join now'].map((item, i) => (
            <li key={i}>
              <a
                href={item === 'About' ? '#about' : '#home'}
                onMouseEnter={() => setHoveredNav(i)}
                onMouseLeave={() => setHoveredNav(null)}
                style={{
                  color: hoveredNav === i ? C.iceBlue : C.textSec,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 400,
                  transition: 'color 0.2s ease',
                  ...(item === 'Join now' ? {
                    background: C.deepBlue,
                    color: hoveredNav === i ? C.textPrim : C.iceBlue,
                    padding: '6px 16px',
                    borderRadius: 6,
                    border: `0.5px solid ${C.borderAcc}`,
                  } : {}),
                }}
              >{item}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── HERO ── */}
      <section id="home" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        minHeight: 'calc(100vh - 60px)',
        padding: '60px 48px',
        gap: 48,
        borderBottom: `0.5px solid ${C.borderDef}`,
      }}>

        {/* Left: branding + auth form */}
        <div style={{ flex: '0 0 420px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <h1 style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-2px', margin: '0 0 16px', lineHeight: 1.1 }}>
              <span style={{ color: C.iceBlue }}>Ne</span>
              <span style={{ color: C.textPrim }}>Xora</span>
            </h1>
            <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.7, margin: 0, maxWidth: 360 }}>
              Step into NeXora, the playground for the wildly imaginative, where vibrant communities thrive and eccentricities are celebrated.
            </p>
          </div>

          {/* Auth card */}
          <div style={{
            background: C.cardBg,
            border: `0.5px solid ${C.borderDef}`,
            borderRadius: 12,
            padding: '28px 28px 24px',
          }}>
            {isLoginBox
              ? <Login setIsLoginBox={setIsLoginBox} />
              : <Register setIsLoginBox={setIsLoginBox} />
            }
          </div>
        </div>

        {/* Right: decorative visual */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 480,
          position: 'relative',
        }}>
          {/* Glow blob */}
          <div style={{
            position: 'absolute',
            width: 320, height: 320,
            background: `radial-gradient(circle, rgba(178,211,230,0.08) 0%, transparent 70%)`,
            borderRadius: '50%',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }} />
          {/* Phone frame mockup */}
          <div style={{
            width: 220, height: 420,
            background: C.elevated,
            border: `0.5px solid ${C.borderHov}`,
            borderRadius: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 0 80px rgba(178,211,230,0.06)',
          }}>
            <div style={{
              width: 180, height: 360,
              background: C.cardBg,
              borderRadius: 24,
              border: `0.5px solid ${C.borderDef}`,
              display: 'flex', flexDirection: 'column',
              padding: 16, gap: 12,
            }}>
              {/* Mock post 1 */}
              {[1, 2, 3].map(n => (
                <div key={n} style={{
                  background: C.elevated,
                  border: `0.5px solid ${C.borderDef}`,
                  borderRadius: 8, padding: '10px 12px',
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: C.deepBlue, border: `0.5px solid ${C.iceBlue}` }} />
                    <div style={{ width: 60, height: 8, background: C.borderHov, borderRadius: 4 }} />
                  </div>
                  <div style={{ width: '90%', height: 6, background: C.borderDef, borderRadius: 4 }} />
                  <div style={{ width: '70%', height: 6, background: C.borderDef, borderRadius: 4 }} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                    <div style={{ width: 20, height: 6, background: C.deepBlue, borderRadius: 4 }} />
                    <div style={{ width: 20, height: 6, background: C.borderDef, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
            {/* Side accent bars */}
            <div style={{
              position: 'absolute', right: -10, top: '20%',
              width: 4, height: 80,
              background: C.iceBlue,
              borderRadius: 2, opacity: 0.5,
            }} />
            <div style={{
              position: 'absolute', left: -10, top: '50%',
              width: 4, height: 50,
              background: C.midBlue,
              borderRadius: 2, opacity: 0.3,
            }} />
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: '80px 48px', display: 'flex', flexDirection: 'column', gap: 80 }}>

        {/* About 1 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
          <img src={About1} alt="Stay Connected" style={{
            width: 340, height: 240, objectFit: 'cover',
            borderRadius: 12, border: `0.5px solid ${C.borderDef}`,
            flexShrink: 0,
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 28, fontWeight: 600, color: C.textPrim, margin: 0, letterSpacing: '-0.5px' }}>Stay Connected</h3>
            <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.8, margin: 0, maxWidth: 480 }}>
              NeXora makes it easy to maintain touch with your old friends, regardless of geographical boundaries. Connect with them on the platform, follow their profiles, and keep up with their updates.
            </p>
            <a href="#home" style={{
              display: 'inline-block',
              background: C.deepBlue,
              color: C.iceBlue,
              border: `0.5px solid ${C.borderAcc}`,
              padding: '10px 24px',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              width: 'fit-content',
            }}>Join now</a>
          </div>
        </div>

        {/* About 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 60, flexDirection: 'row-reverse' }}>
          <img src={About2} alt="Amplify Your Voice" style={{
            width: 340, height: 240, objectFit: 'cover',
            borderRadius: 12, border: `0.5px solid ${C.borderDef}`,
            flexShrink: 0,
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 28, fontWeight: 600, color: C.textPrim, margin: 0, letterSpacing: '-0.5px' }}>Amplify Your Voice</h3>
            <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.8, margin: 0, maxWidth: 480 }}>
              NeXora gives you the power to amplify your voice and share your unique perspective with a global audience. Whether you're an artist, a writer, or a creator — NeXora gives you the stage to showcase your talent.
            </p>
            <a href="#home" style={{
              display: 'inline-block',
              background: C.deepBlue,
              color: C.iceBlue,
              border: `0.5px solid ${C.borderAcc}`,
              padding: '10px 24px',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              width: 'fit-content',
            }}>Join now</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `0.5px solid ${C.borderDef}`,
        padding: '24px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{ color: C.textMuted, fontSize: 13, margin: 0 }}>
          All rights reserved — &copy; NeXora.com
        </p>
      </footer>

    </div>
  );
};

export default LandingPage;