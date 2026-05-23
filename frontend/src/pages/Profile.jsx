import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Grid3X3, Bookmark, LogOut, Camera, Edit2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthenticationContext } from '../context/AuthenticationContextProvider';
import { GeneralContext } from '../context/GeneralContextProvider';
import Topbar from '../components/Topbar';
import Notifications from '../components/Notifications';
import CreatePost from '../components/CreatePost';
import useWindowWidth from '../hooks/useWindowWidth';

const TABS = [
  { id: 'posts', icon: Grid3X3,  label: 'Posts' },
  { id: 'saved', icon: Bookmark, label: 'Saved' },
];

/* ── Grid Item ─────────────────────────────────────────────────── */
const GridItem = ({ post, onClick, idx }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.94 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: Math.min(idx * 0.04, 0.5) }}
    className="profile-grid-item"
    onClick={() => onClick(post)}
    role="button"
    tabIndex={0}
    aria-label={`View post by ${post.userName}`}
    onKeyDown={e => e.key === 'Enter' && onClick(post)}
  >
    {post.fileType === 'photo' ? (
      <img src={post.file} alt="" loading="lazy" />
    ) : (
      <video muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
        <source src={post.file} />
      </video>
    )}
    <div className="grid-overlay">
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#fff' }}>
        <Heart size={16} fill="#fff" />
        <span style={{ fontWeight: 700, fontSize: 13 }}>{post.likes?.length ?? 0}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#fff' }}>
        <MessageCircle size={16} fill="#fff" />
        <span style={{ fontWeight: 700, fontSize: 13 }}>{post.comments?.length ?? 0}</span>
      </div>
    </div>
  </motion.div>
);

/* ── Post Detail Modal ─────────────────────────────────────────── */
const PostDetailModal = ({ post, onClose, socket, isOwn, onDelete }) => {
  const userId = localStorage.getItem('userId');
  const [isLiked, setIsLiked]     = useState(post?.likes?.includes(userId));
  const [likesCount, setLikesCount] = useState(post?.likes?.length ?? 0);
  const [comment, setComment]     = useState('');
  const width = useWindowWidth();
  const isMobile = width <= 768;

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const handleLike = () => {
    if (isLiked) {
      socket.emit('postUnLiked', { userId, postId: post._id });
      setIsLiked(false); setLikesCount(c => c - 1);
    } else {
      socket.emit('postLiked', { userId, postId: post._id });
      setIsLiked(true); setLikesCount(c => c + 1);
    }
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    socket.emit('makeComment', { postId: post._id, username: localStorage.getItem('username'), comment });
    setComment('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="post-modal-backdrop"
      onClick={onClose}
      role="dialog" aria-modal="true" aria-label="Post detail"
    >
      <motion.div
        initial={isMobile ? { y: '100%' } : { scale: 0.92, opacity: 0 }}
        animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
        exit={isMobile ? { y: '100%' } : { scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="post-modal-inner"
        onClick={e => e.stopPropagation()}
      >
        {/* Media */}
        <div className="post-modal-media">
          {post.fileType === 'photo' ? (
            <img src={post.file} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <video controls autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
              <source src={post.file} />
            </video>
          )}
        </div>

        {/* Detail panel */}
        <div className="post-modal-detail">
          {/* Header */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={post.userPic} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-acc)', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>{post.userName}</p>
                {post.location && <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{post.location}</p>}
              </div>
            </div>
            {isOwn && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => { onDelete(post._id); onClose(); }}
                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                Delete
              </motion.button>
            )}
          </div>

          {/* Comments */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
            {post.description && (
              <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', marginRight: 6 }}>{post.userName}</span>
                  {post.description}
                </p>
              </div>
            )}
            {post.comments?.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--bg-elevated)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>
                  {c[0]?.[0]?.toUpperCase()}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', marginRight: 5 }}>{c[0]}</span>{c[1]}
                </p>
              </div>
            ))}
          </div>

          {/* Actions + comment input */}
          <div style={{ borderTop: '1px solid var(--border)', padding: '10px 14px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }} onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLiked ? '#EC4899' : 'var(--text-secondary)', padding: 0, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center' }}>
                <Heart size={22} fill={isLiked ? '#EC4899' : 'none'} strokeWidth={isLiked ? 0 : 2} />
              </motion.button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center' }}>
                <MessageCircle size={22} />
              </button>
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, margin: '0 0 10px', color: 'var(--text-primary)' }}>{likesCount.toLocaleString()} likes</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="input-premium"
                placeholder="Add a comment…"
                value={comment}
                onChange={e => setComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleComment()}
                style={{ borderRadius: 'var(--radius-full)', fontSize: 12, padding: '8px 14px', flex: 1 }}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleComment}
                disabled={!comment.trim()}
                style={{ background: comment.trim() ? 'var(--accent)' : 'var(--bg-elevated)', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: comment.trim() ? 'pointer' : 'not-allowed', flexShrink: 0 }}
              >
                Post
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Profile Page ───────────────────────────────────────────────── */
const Profile = () => {
  const { logout }   = useContext(AuthenticationContext);
  const { socket }   = useContext(GeneralContext);
  const { id }       = useParams();
  const userId       = localStorage.getItem('userId');
  const width        = useWindowWidth();
  const isMobile     = width <= 480;

  const [userProfile, setUserProfile] = useState({});
  const [posts, setPosts]             = useState([]);
  const [activeTab, setActiveTab]     = useState('posts');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing]     = useState(false);
  const [editPic, setEditPic]         = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editAbout, setEditAbout]     = useState('');
  const [savedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedPosts')) ?? []; }
    catch { return []; }
  });

  const isOwnProfile  = userProfile._id === userId;
  const followingList = localStorage.getItem('following') || '';
  const isFollowing   = followingList.includes(userProfile._id);
  const userPosts     = posts.filter(p => p.userId === userProfile._id);
  const savedPosts    = activeTab === 'saved' ? posts.filter(p => savedIds.includes(p._id)) : [];
  const displayPosts  = activeTab === 'posts' ? userPosts : savedPosts;

  useEffect(() => {
    socket.emit('fetch-profile', { _id: id });
    socket.on('profile-fetched', ({ profile }) => {
      if (!profile) return;
      setUserProfile(profile);
      setEditPic(profile.profilePic || '');
      setEditUsername(profile.username || '');
      setEditAbout(profile.about || '');
    });
    return () => socket.off('profile-fetched');
  }, [socket, id]);

  useEffect(() => {
    axios.get('http://localhost:6001/fetchAllPosts')
      .then(({ data }) => setPosts(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    socket.on('userFollowed',   ({ following }) => localStorage.setItem('following', following));
    socket.on('userUnFollowed', ({ following }) => localStorage.setItem('following', following));
    socket.on('post-deleted',   ({ posts }) => setPosts(posts));
    return () => { socket.off('userFollowed'); socket.off('userUnFollowed'); socket.off('post-deleted'); };
  }, [socket]);

  const handleFollow   = () => socket.emit('followUser',   { ownId: userId, followingUserId: userProfile._id });
  const handleUnFollow = () => socket.emit('unFollowUser', { ownId: userId, followingUserId: userProfile._id });
  const handleUpdate   = () => {
    socket.emit('updateProfile', { userId: userProfile._id, profilePic: editPic, username: editUsername, about: editAbout });
    setIsEditing(false);
    toast.success('Profile updated!');
  };
  const handleDeletePost = (postId) => {
    socket.emit('delete-post', { postId });
    toast.success('Post deleted');
  };

  /* Avatar size: responsive */
  const avatarSize = isMobile ? 80 : 86;

  return (
    <div style={{ minHeight: '100vh', minHeight: '100dvh', background: 'var(--bg-primary)' }}>
      <Topbar />

      <div className="profile-page-wrap">
        {/* ── Profile Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
          className="profile-header-flex"
        >
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: avatarSize, height: avatarSize, borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #06B6D4)',
              padding: 3,
            }}>
              <div style={{ background: 'var(--bg-base)', borderRadius: '50%', padding: 2, width: '100%', height: '100%' }}>
                <img
                  src={userProfile.profilePic || ''}
                  alt={userProfile.username || 'Profile'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }}
                />
              </div>
            </div>
            {isOwnProfile && (
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                aria-label="Edit profile picture"
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'var(--accent)', border: '2px solid var(--bg-base)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Camera size={12} color="#fff" />
              </motion.button>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: isMobile ? '100%' : 200 }}>
            {/* Username + actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
              <h2 style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 300, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.3px' }}>
                {userProfile.username || '—'}
              </h2>
              {isOwnProfile ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                    onClick={() => setIsEditing(true)}
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: 10, padding: '6px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Edit2 size={13} /> Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center' }}
                    aria-label="Logout"
                  >
                    <LogOut size={18} />
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={isFollowing ? handleUnFollow : handleFollow}
                    className={`follow-btn ${isFollowing ? 'following' : 'follow'}`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: 10, padding: '6px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Message
                  </motion.button>
                </>
              )}
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: isMobile ? 24 : 32, marginBottom: 12, justifyContent: isMobile ? 'center' : 'flex-start' }}>
              {[
                { label: 'posts',     value: userPosts.length },
                { label: 'followers', value: userProfile.followers?.length ?? 0 },
                { label: 'following', value: userProfile.following?.length ?? 0 },
              ].map(({ label, value }) => (
                <div key={label} style={{ cursor: 'pointer', textAlign: isMobile ? 'center' : 'left' }}>
                  <span style={{ fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                    {value.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: 'var(--text-secondary)' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Bio */}
            {userProfile.about && (
              <p style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, textAlign: isMobile ? 'center' : 'left', maxWidth: 400 }}>
                {userProfile.about}
              </p>
            )}
          </div>
        </motion.div>

        {/* ── Edit Form ── */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-acc)', borderRadius: 'var(--radius-xl)', padding: 'clamp(16px, 3vw, 24px)', marginBottom: 20, boxShadow: 'var(--shadow-glow)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 4, height: 18, background: 'var(--accent)', borderRadius: 2 }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Edit Profile</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Profile picture URL', value: editPic,      setter: setEditPic },
                  { label: 'Username',             value: editUsername, setter: setEditUsername },
                  { label: 'Bio',                  value: editAbout,   setter: setEditAbout },
                ].map(({ label, value, setter }) => (
                  <div key={label}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>
                      {label}
                    </label>
                    <input className="input-premium" value={value} onChange={e => setter(e.target.value)} placeholder={`Enter ${label.toLowerCase()}…`} />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={() => setIsEditing(false)} style={{ flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 10, padding: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Cancel
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={handleUpdate} className="btn-gradient" style={{ flex: 1, borderRadius: 10, padding: 10, fontSize: 13 }}>
                    Save changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Tab Switcher ── */}
        <div className="tab-switcher">
          {TABS.map(({ id, icon: Icon, label }) => (
            (isOwnProfile || id === 'posts') ? (
              <motion.button
                key={id}
                whileTap={{ scale: 0.96 }}
                className={`tab-btn ${activeTab === id ? 'active' : ''}`}
                onClick={() => setActiveTab(id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <Icon size={15} />
                <span>{label}</span>
              </motion.button>
            ) : null
          ))}
        </div>

        {/* ── Post Grid ── */}
        {displayPosts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: 'clamp(40px, 8vw, 60px) 24px' }}>
            <p style={{ fontSize: 36, marginBottom: 10 }}>{activeTab === 'saved' ? '🔖' : '📷'}</p>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              {activeTab === 'saved' ? 'No saved posts' : 'No posts yet'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              {activeTab === 'saved' ? 'Save posts to see them here.' : isOwnProfile ? 'Share your first moment!' : 'Nothing here yet.'}
            </p>
          </motion.div>
        ) : (
          <div className="profile-grid" style={{ marginTop: 1 }}>
            {displayPosts.map((post, i) => (
              <GridItem key={post._id} post={post} idx={i} onClick={setSelectedPost} />
            ))}
          </div>
        )}
      </div>

      {/* Post detail modal */}
      <AnimatePresence>
        {selectedPost && (
          <PostDetailModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            socket={socket}
            isOwn={selectedPost.userId === userId}
            onDelete={handleDeletePost}
          />
        )}
      </AnimatePresence>

      <Notifications />
      <CreatePost />
    </div>
  );
};

export default Profile;