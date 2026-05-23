import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, Globe, MessageCircle, Film, Star, ArrowRight } from 'lucide-react';
import Login from '../components/Login';
import Register from '../components/Register';

const FEATURES = [
  { icon: Heart,         label: 'Moments', desc: 'Double-tap to love anything. Every post tells a story.',          color: '#F4849A' },
  { icon: MessageCircle, label: 'Connect',  desc: 'Real-time chat with read receipts and media sharing.',           color: '#B89FD8' },
  { icon: Film,          label: 'Reels',    desc: 'Cinematic short-form video with snap-scroll discovery.',         color: '#84C5F4' },
  { icon: Globe,         label: 'Global',   desc: 'A warm community spanning 140+ countries worldwide.',            color: '#F4C16A' },
  { icon: Shield,        label: 'Private',  desc: 'End-to-end encrypted with full control over your privacy.',      color: '#98D8A8' },
  { icon: Star,          label: 'Premium',  desc: 'Cinematic UI with buttery-smooth micro-animations.',             color: '#F4A0C0' },
];

/* ── Floating phone mock ─────────────────────────────────── */
const PhoneMock = () => (
  <motion.div
    animate={{ y: [0, -14, 0] }}
    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    style={{
      width: 210, height: 430, borderRadius: 40,
      background: 'linear-gradient(145deg, #FAFAF9, #F0EEF5)',
      border: '1px solid rgba(255,255,255,0.9)',
      boxShadow: '24px 24px 60px rgba(160,150,190,0.35), -12px -12px 40px rgba(255,255,255,0.9), 0 0 0 1px rgba(180,170,210,0.15)',
      position: 'relative', overflow: 'hidden', flexShrink: 0,
    }}
  >
    {/* Notch */}
    <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 50, height: 5, background: '#D8D5E8', borderRadius: 3 }} />

    {/* Screen */}
    <div style={{ position: 'absolute', top: 26, left: 8, right: 8, bottom: 8, borderRadius: 32, background: '#ECEAF4', overflow: 'hidden', padding: 10 }}>
      {/* Mini top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: 'italic', fontWeight: 600, background: 'linear-gradient(135deg, #F4849A, #B89FD8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Lumina</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[0,1].map(i => <div key={i} style={{ width: 18, height: 18, borderRadius: '50%', background: '#FAFAF9', boxShadow: '2px 2px 6px rgba(160,150,190,0.3), -1px -1px 4px rgba(255,255,255,0.9)' }} />)}
        </div>
      </div>

      {/* Mini stories */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 12 }}>
        {['#F4849A', '#B89FD8', '#84C5F4', '#F4C16A'].map((col, i) => (
          <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', padding: 2, background: `linear-gradient(135deg, ${col}, ${col}88)` }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#FAFAF9' }} />
          </div>
        ))}
      </div>

      {/* Mini post cards */}
      {[
        { h: 80, colors: ['#F4849A', '#B89FD8'] },
        { h: 65, colors: ['#84C5F4', '#B89FD8'] },
      ].map((p, i) => (
        <div key={i} style={{ background: '#FAFAF9', borderRadius: 12, padding: '7px 8px', marginBottom: 8, boxShadow: '3px 3px 10px rgba(160,150,190,0.2), -2px -2px 6px rgba(255,255,255,0.9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` }} />
            <div style={{ height: 4, width: '50%', background: '#E4E2EF', borderRadius: 2 }} />
          </div>
          <div style={{ height: p.h, borderRadius: 8, background: `linear-gradient(160deg, ${p.colors[0]}33, ${p.colors[1]}22)`, marginBottom: 5, border: `1px solid ${p.colors[0]}22` }} />
          <div style={{ display: 'flex', gap: 5 }}>
            <div style={{ height: 4, width: 14, background: p.colors[0], borderRadius: 2, opacity: 0.7 }} />
            <div style={{ height: 4, width: 10, background: '#E4E2EF', borderRadius: 2 }} />
          </div>
        </div>
      ))}

      {/* Mini bottom nav */}
      <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, height: 36, background: 'rgba(255,255,255,0.85)', borderRadius: 20, backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', boxShadow: '0 4px 12px rgba(160,150,190,0.2)' }}>
        {[0,1].map(i => <div key={i} style={{ width: 20, height: 20, borderRadius: '50%', background: i === 0 ? '#F4849A22' : 'transparent' }} />)}
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #F4849A, #B89FD8)' }} />
        {[0,1].map(i => <div key={i} style={{ width: 20, height: 20, borderRadius: '50%' }} />)}
      </div>
    </div>
  </motion.div>
);

/* ══ LANDING PAGE ═════════════════════════════════════════ */
const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>

      {/* Ambient blobs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,132,154,0.08), transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,159,216,0.08), transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '40%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(132,197,244,0.06), transparent 70%)' }} />
      </div>

      {/* ── Navbar ── */}
      <motion.nav
        style={{
          position: 'sticky', top: 0, zIndex: 120, height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: scrolled ? 'rgba(236,234,244,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : 'none',
          transition: 'all 0.35s ease',
        }}
      >
        <div style={{ width: '100%', maxWidth: 1100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontStyle: 'italic', fontWeight: 600, background: 'var(--grad-cta)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Lumina</span>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {['Features', 'Community'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '6px 14px', borderRadius: 'var(--radius-full)', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.color = 'var(--text-primary)'; e.target.style.background = 'var(--bg-card)'; }}
                onMouseLeave={e => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'transparent'; }}
              >
                {l}
              </a>
            ))}
            <motion.a
              href="#home" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{ padding: '9px 22px', borderRadius: 'var(--radius-full)', background: 'var(--grad-cta)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 20px rgba(244,132,154,0.35)' }}
            >
              Join free →
            </motion.a>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section id="home" style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1060, width: '100%', display: 'flex', alignItems: 'center', gap: 56, flexWrap: 'wrap', justifyContent: 'center' }}>

          {/* Left: Auth card */}
          <div style={{ flex: '0 0 400px', maxWidth: '100%' }}>
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', borderRadius: 'var(--radius-full)', padding: '6px 16px', marginBottom: 20, boxShadow: 'var(--shadow-neu-sm)' }}
            >
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Heart size={12} fill="var(--accent)" color="var(--accent)" />
              </motion.div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Social · Reimagined</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ fontSize: 'clamp(38px, 5vw, 58px)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.06, marginBottom: 16, color: 'var(--text-primary)' }}
            >
              Where every{' '}
              <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600, background: 'var(--grad-cta)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                moment
              </span>
              {' '}shines.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 28, maxWidth: 360 }}
            >
              A soft, warm social space built for creators who care about beauty. Share your world — beautifully.
            </motion.p>

            {/* Auth card */}
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card), 12px 12px 40px rgba(160,150,190,0.15)', padding: '24px', border: '1px solid rgba(255,255,255,0.9)' }}
            >
              {/* Tab switcher */}
              <div style={{ background: 'var(--bg-base)', borderRadius: 'var(--radius-full)', padding: 4, marginBottom: 20, display: 'flex', gap: 4, boxShadow: 'var(--shadow-neu-inset)' }}>
                {['Sign in', 'Register'].map((label, i) => {
                  const active = isLogin ? i === 0 : i === 1;
                  return (
                    <motion.button
                      key={label}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setIsLogin(i === 0)}
                      style={{
                        flex: 1, padding: '9px 0', border: 'none', cursor: 'pointer',
                        borderRadius: 'var(--radius-full)', fontSize: 13.5, fontWeight: 600,
                        background: active ? 'var(--grad-cta)' : 'transparent',
                        color: active ? '#fff' : 'var(--text-muted)',
                        boxShadow: active ? 'var(--shadow-pill)' : 'none',
                        transition: 'all 0.25s var(--ease-expo)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {label}
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login' : 'register'}
                  initial={{ opacity: 0, x: isLogin ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isLogin ? 10 : -10 }}
                  transition={{ duration: 0.18 }}
                >
                  {isLogin ? <Login setIsLoginBox={setIsLogin} /> : <Register setIsLoginBox={setIsLogin} />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right: Phone + floating chips */}
          <motion.div
            initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', flexShrink: 0 }}
          >
            <PhoneMock />

            {/* Floating stat chips */}
            {[
              { label: '2.4M', sub: 'Active users', color: 'var(--accent)', top: '8%', left: '-48%' },
              { label: '99%', sub: 'Uptime', color: '#B89FD8', top: '55%', right: '-42%' },
              { label: '50M+', sub: 'Posts shared', color: '#84C5F4', bottom: '12%', left: '-44%' },
            ].map(({ label, sub, color, ...pos }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                transition={{ opacity: { delay: 0.9, duration: 0.4 }, scale: { delay: 0.9, duration: 0.4 }, y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } }}
                style={{
                  position: 'absolute', ...pos,
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '10px 14px',
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid rgba(255,255,255,0.9)',
                  whiteSpace: 'nowrap',
                }}
              >
                <p style={{ fontSize: 18, fontWeight: 800, color, margin: 0, letterSpacing: '-0.8px' }}>{label}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '80px 32px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Built for you</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-1.5px', margin: 0, color: 'var(--text-primary)' }}>
              Everything a creator needs
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {FEATURES.map(({ icon: Icon, label, desc, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4, boxShadow: '12px 12px 36px rgba(160,150,190,0.25), -6px -6px 24px rgba(255,255,255,0.95)' }}
                style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: '22px', border: '1px solid rgba(255,255,255,0.9)', boxShadow: 'var(--shadow-card)', transition: 'all 0.3s var(--ease-expo)' }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 14, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>{label}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="community" style={{ padding: '80px 32px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          style={{ maxWidth: 580, margin: '0 auto', background: 'var(--bg-card)', borderRadius: 'var(--radius-2xl)', padding: '56px 40px', boxShadow: 'var(--shadow-card), 16px 16px 48px rgba(160,150,190,0.15)', border: '1px solid rgba(255,255,255,0.9)' }}
        >
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ fontSize: 52, marginBottom: 16 }}>✨</motion.div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 900, letterSpacing: '-1.5px', margin: '0 0 12px', color: 'var(--text-primary)' }}>
            Ready to shine on{' '}
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', background: 'var(--grad-cta)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Lumina</span>?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: '0 0 28px', lineHeight: 1.65 }}>
            Join 2.4 million creators sharing their light — always free.
          </p>
          <motion.a
            href="#home"
            whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(244,132,154,0.45)' }}
            whileTap={{ scale: 0.96 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 'var(--radius-full)', background: 'var(--grad-cta)', color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none', boxShadow: 'var(--shadow-pill)' }}
          >
            Get started free <ArrowRight size={16} />
          </motion.a>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, position: 'relative', zIndex: 1 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontStyle: 'italic', fontWeight: 600, background: 'var(--grad-cta)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Lumina</span>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>© 2025 Lumina. Made with ✨</p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#home" style={{ fontSize: 12.5, color: 'var(--text-muted)', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;