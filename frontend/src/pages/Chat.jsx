import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/chat/Sidebar';
import UserChat from '../components/chat/UserChat';
import { GeneralContext } from '../context/GeneralContextProvider';
import useWindowWidth from '../hooks/useWindowWidth';

/* ─── Design Tokens ─────────────────────────────────────────────── */
const T = {
  pageBg:   '#07080C',
  cardBg:   '#0D0F17',
  textPrim: '#F0F2FF',
  textSec:  '#7B82A0',
  border:   'rgba(255,255,255,0.05)',
};

const STYLES = `
  @keyframes chat-fade-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .chat-page-enter {
    animation: chat-fade-in 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  /* Subtle grid on main panel */
  .chat-main-panel::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(${T.border} 1px, transparent 1px),
      linear-gradient(90deg, ${T.border} 1px, transparent 1px);
    background-size: 48px 48px;
    opacity: 0.35;
    pointer-events: none; z-index: 0;
  }
  .chat-main-panel > * { position: relative; z-index: 1; }

  /* Mobile back button */
  .chat-mobile-back {
    display: none;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: ${T.cardBg};
    border-bottom: 1px solid ${T.border};
    cursor: pointer;
    color: ${T.textSec};
    font-size: 14px;
    font-weight: 500;
    flex-shrink: 0;
  }
  @media (max-width: 768px) {
    .chat-mobile-back { display: flex; }
    /* Slide transition for mobile chat panels */
    .chat-sidebar-mobile-active {
      position: absolute !important;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 10;
    }
  }
`;

const Chat = () => {
  const [mounted, setMounted] = useState(false);
  const { chatData }          = useContext(GeneralContext);
  const width                 = useWindowWidth();
  const isMobile              = width <= 768;

  // On mobile: show sidebar OR chat panel, not both
  const [mobileView, setMobileView] = useState('sidebar'); // 'sidebar' | 'chat'

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // When a chat is selected on mobile, switch to chat view
  useEffect(() => {
    if (isMobile && chatData?.chatId) {
      setMobileView('chat');
    }
  }, [chatData?.chatId, isMobile]);

  // Navbar height: 56px mobile, 72px desktop
  const navbarH = isMobile ? 56 : 72;
  const bottomPad = isMobile ? 'calc(56px + var(--safe-bottom))' : '0px';

  return (
    <>
      <style>{STYLES}</style>

      <div
        className={`${mounted ? 'chat-page-enter' : ''}`}
        style={{
          background: T.pageBg,
          minHeight: '100vh', minHeight: '100dvh',
          display: 'flex', flexDirection: 'column',
          fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
          color: T.textPrim,
          overflowX: 'hidden',
        }}
      >
        <Navbar />

        {/* Chat layout */}
        <div
          className="chat-layout-wrap"
          style={{
            display: 'flex',
            flex: 1,
            height: `calc(100dvh - ${navbarH}px)`,
            marginTop: 0,
            paddingBottom: bottomPad,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* ── DESKTOP: Both panels visible ── */}
          {!isMobile && (
            <>
              <div className="chat-sidebar-panel" style={{ width: 300 }}>
                <Sidebar />
              </div>
              <div className="chat-main-panel">
                <UserChat />
              </div>
            </>
          )}

          {/* ── MOBILE: Either sidebar or chat ── */}
          {isMobile && (
            <>
              <AnimatePresence mode="wait">
                {mobileView === 'sidebar' ? (
                  <motion.div
                    key="sidebar"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.16,1,0.3,1] }}
                    style={{ position: 'absolute', inset: 0, background: T.cardBg, zIndex: 5, overflow: 'hidden' }}
                  >
                    <Sidebar onSelectChat={() => setMobileView('chat')} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.16,1,0.3,1] }}
                    style={{ position: 'absolute', inset: 0, background: T.pageBg, zIndex: 5, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                  >
                    {/* Back button */}
                    <button
                      onClick={() => setMobileView('sidebar')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '12px 16px', background: T.cardBg,
                        border: 'none', borderBottom: `1px solid ${T.border}`,
                        cursor: 'pointer', color: '#6C8EFF',
                        fontSize: 14, fontWeight: 600,
                        fontFamily: 'inherit', flexShrink: 0,
                      }}
                    >
                      <ChevronLeft size={18} />
                      Messages
                    </button>
                    {/* Chat area */}
                    <div className="chat-main-panel" style={{ flex: 1, minHeight: 0 }}>
                      <UserChat />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Empty state when no chat selected (desktop) */}
          {!isMobile && !chatData?.chatId && (
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0,
              left: 300,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: T.pageBg, gap: 16,
              color: T.textSec,
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(108,142,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MessageSquare size={32} color="#6C8EFF" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 16, fontWeight: 600, color: T.textPrim, marginBottom: 6 }}>Your Messages</p>
                <p style={{ fontSize: 13, color: T.textSec }}>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;