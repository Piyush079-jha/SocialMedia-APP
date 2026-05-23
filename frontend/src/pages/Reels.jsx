import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Share2, Bookmark,
  Volume2, VolumeX, Play,
  ChevronUp, ChevronDown, X, Send
} from 'lucide-react';
import Topbar from '../components/Topbar';

/* ══════════════════════════════════════════════════════
   PEXELS API CONFIG  — optional
   Create frontend/.env → REACT_APP_PEXELS_API_KEY=your_key
══════════════════════════════════════════════════════ */
const PEXELS_KEY = process.env.REACT_APP_PEXELS_API_KEY || '';

/* ── Fallback videos (public Google CDN — always work) ── */
const FALLBACK_REELS = [
  {
    id: 'f1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://picsum.photos/seed/skate/400/700',
    author: { name: 'Alex Rivera', avatar: 'https://picsum.photos/seed/alex/80/80' },
    likes: 24891, comments: 342,
    description: '🔥 Starting the day with some fire tricks downtown. The city is my canvas!',
    tags: ['#skate', '#urban', '#lifestyle'],
  },
  {
    id: 'f2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://picsum.photos/seed/workout/400/700',
    author: { name: 'Jordan Lee', avatar: 'https://picsum.photos/seed/jordan/80/80' },
    likes: 18320, comments: 218,
    description: '💪 Workout has always been a routine to start every activity in my day!',
    tags: ['#fitness', '#workout', '#motivation'],
  },
  {
    id: 'f3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://picsum.photos/seed/cooking/400/700',
    author: { name: 'Mia Chen', avatar: 'https://picsum.photos/seed/mia/80/80' },
    likes: 52400, comments: 891,
    description: "🍳 Cooking is art. Today I'm making my grandma's secret recipe.",
    tags: ['#food', '#cooking', '#chef'],
  },
  {
    id: 'f4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://picsum.photos/seed/nature/400/700',
    author: { name: 'Sam Woods', avatar: 'https://picsum.photos/seed/sam/80/80' },
    likes: 31200, comments: 455,
    description: "🌿 Lost in nature's beauty. Shot this timelapse over 3 hours!",
    tags: ['#nature', '#travel', '#earth'],
  },
  {
    id: 'f5',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnail: 'https://picsum.photos/seed/tech2/400/700',
    author: { name: 'Tech Guru', avatar: 'https://picsum.photos/seed/tech/80/80' },
    likes: 44100, comments: 671,
    description: '📦 Unboxing the latest gadgets! Is this worth the hype? Watch to find out!',
    tags: ['#tech', '#gadgets', '#review'],
  },
  {
    id: 'f6',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnail: 'https://picsum.photos/seed/city/400/700',
    author: { name: 'Night Rider', avatar: 'https://picsum.photos/seed/night/80/80' },
    likes: 67300, comments: 1204,
    description: '🌃 City never sleeps. Cruising through downtown lights at midnight.',
    tags: ['#city', '#night', '#drive'],
  },
  {
    id: 'f7',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://picsum.photos/seed/art2/400/700',
    author: { name: 'Art Studio', avatar: 'https://picsum.photos/seed/art/80/80' },
    likes: 29800, comments: 532,
    description: '🎨 Creating something from nothing. Art is the language of the soul.',
    tags: ['#art', '#design', '#creative'],
  },
];

/* ── Pexels fetch ── */
const fetchPexelsReels = async () => {
  if (!PEXELS_KEY) return null;
  try {
    const res = await fetch(
      'https://api.pexels.com/videos/popular?per_page=15&size=medium',
      { headers: { Authorization: PEXELS_KEY } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (data.videos || []).map(v => {
      const file = v.video_files.find(f => f.quality === 'sd') || v.video_files[0];
      return {
        id: `px_${v.id}`,
        videoUrl: file?.link,
        thumbnail: v.image,
        author: { name: v.user.name, avatar: `https://picsum.photos/seed/${v.user.id}/80/80` },
        likes: Math.floor(Math.random() * 50000 + 1000),
        comments: Math.floor(Math.random() * 500 + 20),
        description: `🎥 Amazing moment by ${v.user.name}. #pexels #video`,
        tags: ['#photography', '#video', '#pexels'],
      };
    }).filter(v => v.videoUrl);
  } catch { return null; }
};

const fmt = n => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

/* ══════════════════════════════════════════════════════
   STYLES — all inline so nothing can override them
══════════════════════════════════════════════════════ */
const S = {
  page: {
    position: 'fixed', inset: 0,
    background: '#000', zIndex: 50,
    display: 'flex', flexDirection: 'column',
  },
  feed: {
    flex: 1,
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    scrollPaddingTop: '64px',
    WebkitOverflowScrolling: 'touch',
    overscrollBehavior: 'contain',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  },
  item: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    background: '#000',
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    cursor: 'pointer',
    background: '#000',
  },
  overlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.8) 100%)',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    pointerEvents: 'none',
  },
  info: {
    padding: '16px 16px 40px',
    pointerEvents: 'all',
  },
  author: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
  },
  actions: {
    position: 'absolute', right: 12, bottom: 80,
    display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center',
    pointerEvents: 'all',
  },
  actionBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    background: 'none', border: 'none', cursor: 'pointer', color: '#fff',
  },
  actionIcon: {
    width: 44, height: 44, borderRadius: '50%',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  muteBtn: {
    position: 'absolute', top: 76, right: 14,
    width: 36, height: 36, borderRadius: '50%',
    background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(8px)', zIndex: 10, pointerEvents: 'all',
  },
  progress: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 2, background: 'rgba(255,255,255,0.2)', zIndex: 10,
  },
  progressBar: {
    height: '100%', background: '#fff', transition: 'width 0.1s linear',
  },
  followBtn: {
    padding: '4px 14px', borderRadius: 999,
    background: 'rgba(255,255,255,0.2)', color: '#fff',
    border: '1px solid rgba(255,255,255,0.5)',
    fontSize: 12, fontWeight: 600, cursor: 'pointer',
    backdropFilter: 'blur(8px)', fontFamily: 'inherit',
  },
};

/* ══ SINGLE REEL CARD ════════════════════════════════ */
const ReelCard = ({ reel, isActive, muted, onMuteToggle, onLike, likedReels, savedReels, onSave }) => {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [heartBurst, setHeartBurst] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const liked = likedReels.includes(reel.id);
  const saved = savedReels.includes(reel.id);

  /* ── Play / pause based on active state ── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted; // always keep muted in sync
    if (isActive) {
      v.currentTime = 0;
      v.play().catch(() => {
        // Retry once after a short delay (some browsers need this)
        setTimeout(() => { v.play().catch(() => {}); }, 300);
      });
      setPaused(false);
    } else {
      v.pause();
    }
  }, [isActive]); // eslint-disable-line

  /* ── Muted sync ── */
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  /* ── Progress bar ── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setProgress((v.currentTime / (v.duration || 1)) * 100);
    v.addEventListener('timeupdate', onTime);
    return () => v.removeEventListener('timeupdate', onTime);
  }, []);

  const togglePause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (paused) { v.play(); setPaused(false); }
    else { v.pause(); setPaused(true); }
  };

  const doubleTap = () => {
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 900);
    onLike(reel.id);
  };

  return (
    <>
      {/* Progress bar */}
      <div style={S.progress}>
        <div style={{ ...S.progressBar, width: `${progress}%` }} />
      </div>

      {/* ★ Video — position:absolute fills the container 100% reliably ★ */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.thumbnail}
        loop
        playsInline
        muted
        autoPlay
        preload="auto"
        onClick={togglePause}
        onDoubleClick={doubleTap}
        style={S.video}
      />

      {/* Pause icon */}
      <AnimatePresence>
        {paused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            style={{ position: 'absolute', zIndex: 5, pointerEvents: 'none' }}
          >
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
              <Play size={28} color="#fff" fill="#fff" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Double-tap heart burst */}
      <AnimatePresence>
        {heartBurst && (
          <motion.div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 8 }}>
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: [0, 1.5, 1.1], rotate: [-15, 5, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Heart size={100} fill="#FF5B5B" color="transparent" style={{ filter: 'drop-shadow(0 4px 24px rgba(255,91,91,0.8))' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mute button */}
      <button style={S.muteBtn} onClick={onMuteToggle}>
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* Bottom gradient + info */}
      <div style={S.overlay}>
        <div style={S.info}>
          <div style={S.author}>
            <img
              src={reel.author.avatar} alt={reel.author.name}
              style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.7)', flexShrink: 0 }}
              onError={e => { e.target.src = `https://picsum.photos/seed/u${reel.id}/80/80`; }}
            />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{reel.author.name}</span>
            <button style={S.followBtn}>Follow</button>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, maxWidth: '78%', margin: 0 }}>{reel.description}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {reel.tags?.map(tag => (
              <span key={tag} style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Side action buttons */}
      <div style={S.actions}>
        {/* Like */}
        <motion.button
          style={{ ...S.actionBtn, color: liked ? '#FF5B5B' : '#fff' }}
          whileTap={{ scale: 0.75 }}
          onClick={() => onLike(reel.id)}
        >
          <div style={{ ...S.actionIcon, background: liked ? 'rgba(255,91,91,0.3)' : 'rgba(255,255,255,0.15)' }}>
            <Heart size={22} fill={liked ? '#FF5B5B' : 'none'} color={liked ? '#FF5B5B' : '#fff'} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#fff' }}>{fmt(reel.likes + (liked ? 1 : 0))}</span>
        </motion.button>

        {/* Comment */}
        <motion.button style={S.actionBtn} whileTap={{ scale: 0.85 }} onClick={() => setShowComment(s => !s)}>
          <div style={S.actionIcon}><MessageCircle size={22} color="#fff" /></div>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#fff' }}>{fmt(reel.comments)}</span>
        </motion.button>

        {/* Share */}
        <motion.button style={S.actionBtn} whileTap={{ scale: 0.85 }}>
          <div style={S.actionIcon}><Share2 size={20} color="#fff" /></div>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#fff' }}>Share</span>
        </motion.button>

        {/* Save */}
        <motion.button style={S.actionBtn} whileTap={{ scale: 0.85 }} onClick={() => onSave(reel.id)}>
          <div style={S.actionIcon}><Bookmark size={20} fill={saved ? '#fff' : 'none'} color="#fff" /></div>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#fff' }}>Save</span>
        </motion.button>

        {/* Author mini avatar */}
        <div style={{ position: 'relative', marginTop: 4 }}>
          <img
            src={reel.author.avatar} alt=""
            style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', display: 'block' }}
            onError={e => { e.target.src = `https://picsum.photos/seed/u${reel.id}/80/80`; }}
          />
          <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 16, height: 16, borderRadius: '50%', background: '#FF5B5B', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #000' }}>
            <span style={{ fontSize: 9, color: '#fff', lineHeight: 1 }}>+</span>
          </div>
        </div>
      </div>

      {/* Comment panel */}
      <AnimatePresence>
        {showComment && (
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
              background: 'rgba(14,16,26,0.97)', backdropFilter: 'blur(20px)',
              borderRadius: '24px 24px 0 0', padding: 20,
              maxHeight: '55%', display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Comments ({reel.comments})</span>
              <button onClick={() => setShowComment(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: 12 }}>
              {['Great reel! 🔥', 'This is amazing!', 'Keep it up 💪', '❤️❤️❤️'].map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  <img src={`https://picsum.photos/seed/c${i}/40/40`} alt="" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', margin: '0 0 2px' }}>User{i + 1}</p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{c}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Add a comment..."
                style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, padding: '10px 16px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                style={{ background: '#4F75FF', border: 'none', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
              >
                <Send size={16} color="#fff" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ══ REELS PAGE ════════════════════════════════════════ */
const Reels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const [likedReels, setLikedReels] = useState([]);
  const [savedReels, setSavedReels] = useState([]);
  const feedRef = useRef(null);
  const observerRef = useRef(null);

  /* ── Load reels ── */
  useEffect(() => {
    (async () => {
      const pexels = await fetchPexelsReels();
      setReels(pexels?.length ? pexels : FALLBACK_REELS);
      setLoading(false);
    })();
  }, []);

  /* ── IntersectionObserver: root = scroll container (NOT viewport) ── */
  useEffect(() => {
    if (!feedRef.current || reels.length === 0) return;
    observerRef.current?.disconnect();

    const items = feedRef.current.querySelectorAll('[data-reel-idx]');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          setActiveIdx(Number(entry.target.dataset.reelIdx));
        }
      });
    }, { root: feedRef.current, threshold: 0.5 });

    items.forEach(el => obs.observe(el));
    observerRef.current = obs;
    return () => obs.disconnect();
  }, [reels]);

  const handleLike   = useCallback(id => setLikedReels(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]), []);
  const handleSave   = useCallback(id => setSavedReels(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]), []);

  const scrollTo = idx => {
    const el = feedRef.current?.querySelectorAll('[data-reel-idx]')[idx];
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ── Loading screen ── */
  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <div style={{ width: 48, height: 48, border: '3px solid rgba(255,255,255,0.2)', borderTop: '3px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontSize: 14, opacity: 0.7, margin: 0 }}>Loading Reels...</p>
        {!PEXELS_KEY && <p style={{ fontSize: 12, opacity: 0.4, marginTop: 8 }}>Using sample videos</p>}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={S.page}>
      {/* Topbar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 200 }}>
        <Topbar />
      </div>

      {/* Up/Down nav arrows (desktop) */}
      <div style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 150, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => scrollTo(Math.max(0, activeIdx - 1))}
          disabled={activeIdx === 0}
          style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: activeIdx === 0 ? 0.3 : 1 }}
        >
          <ChevronUp size={20} />
        </motion.button>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'center', userSelect: 'none' }}>
          {activeIdx + 1}/{reels.length}
        </span>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => scrollTo(Math.min(reels.length - 1, activeIdx + 1))}
          disabled={activeIdx === reels.length - 1}
          style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: activeIdx === reels.length - 1 ? 0.3 : 1 }}
        >
          <ChevronDown size={20} />
        </motion.button>
      </div>

      {/* Feed */}
      <div ref={feedRef} style={S.feed}>
        {/* Hide scrollbar in Webkit */}
        <style>{`.reels-feed-inner::-webkit-scrollbar { display: none; }`}</style>

        {reels.map((reel, idx) => (
          <div
            key={reel.id}
            data-reel-idx={idx}
            style={S.item}
          >
            <ReelCard
              reel={reel}
              isActive={activeIdx === idx}
              muted={muted}
              onMuteToggle={() => setMuted(m => !m)}
              onLike={handleLike}
              likedReels={likedReels}
              savedReels={savedReels}
              onSave={handleSave}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reels;
