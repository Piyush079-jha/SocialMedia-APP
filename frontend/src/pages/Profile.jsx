import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineHeart, AiTwotoneHeart } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { FaGlobeAmericas } from 'react-icons/fa';
import HomeLogo from '../components/HomeLogo';
import Navbar from '../components/Navbar';
import { AuthenticationContext } from '../context/AuthenticationContextProvider';
import { GeneralContext } from '../context/GeneralContextProvider';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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

const btnPrimary = (hovered) => ({
  background: hovered ? C.iceBlue : C.deepBlue,
  color: hovered ? C.deepBlue : C.iceBlue,
  border: `0.5px solid ${C.borderAcc}`,
  borderRadius: 8, padding: '9px 20px',
  fontSize: 13, fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.2s, color 0.2s',
});

const btnDanger = {
  background: 'transparent',
  color: '#E24B4A',
  border: '0.5px solid #E24B4A',
  borderRadius: 8, padding: '9px 20px',
  fontSize: 13, fontWeight: 600,
  cursor: 'pointer',
};

const inputStyle = (focused) => ({
  width: '100%',
  background: C.elevated,
  border: `0.5px solid ${focused ? C.borderAcc : C.borderDef}`,
  borderRadius: 8, padding: '10px 14px',
  color: C.textPrim, fontSize: 14,
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
});

const Profile = () => {
  const { logout } = useContext(AuthenticationContext);
  const { socket } = useContext(GeneralContext);
  const { id } = useParams();
  const userId = localStorage.getItem('userId');

  const [userProfile, setUserProfile] = useState([]);
  const [updateProfilePic, setUpdateProfilePic] = useState('');
  const [updateProfileUsername, setUpdateProfileUsername] = useState('');
  const [updateProfileAbout, setUpdateProfileAbout] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  useEffect(() => {
    socket.emit('fetch-profile', { _id: id });
    socket.on('profile-fetched', async ({ profile }) => {
      setUserProfile(profile);
      setUpdateProfilePic(profile.profilePic);
      setUpdateProfileUsername(profile.username);
      setUpdateProfileAbout(profile.about);
    });
  }, [socket]);

  useEffect(() => { fetchPosts(); }, []);
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetchAllPosts');
      setPosts(response.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    socket.on('userFollowed', ({ following }) => localStorage.setItem('following', following));
    socket.on('userUnFollowed', ({ following }) => localStorage.setItem('following', following));
    socket.on('post-deleted', async ({ posts }) => setPosts(posts));
  }, [socket]);

  const handleUpdate = async () => {
    socket.emit('updateProfile', { userId: userProfile._id, profilePic: updateProfilePic, username: updateProfileUsername, about: updateProfileAbout });
    setIsUpdating(false);
  };
  const handleLike = (uid, postId) => socket.emit('postLiked', { userId: uid, postId });
  const handleUnLike = (uid, postId) => socket.emit('postUnLiked', { userId: uid, postId });
  const handleFollow = (uid) => socket.emit('followUser', { ownId: localStorage.getItem('userId'), followingUserId: uid });
  const handleUnFollow = (uid) => socket.emit('unFollowUser', { ownId: localStorage.getItem('userId'), followingUserId: uid });
  const handleComment = (postId, username) => { socket.emit('makeComment', { postId, username, comment }); setComment(''); };
  const handleDeletePost = async (postId) => await socket.emit('delete-post', { postId });

  return (
    <div style={{ background: C.pageBg, minHeight: '100vh', paddingTop: 72, paddingBottom: 72 }}>
      <HomeLogo />
      <Navbar />

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Profile card */}
        {!isUpdating && (
          <div style={{
            background: C.cardBg,
            border: `0.5px solid ${C.borderDef}`,
            borderRadius: 14,
            padding: '28px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          }}>
            <img
              src={userProfile.profilePic} alt=""
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${C.iceBlue}` }}
            />
            <h4 style={{ fontSize: 18, fontWeight: 600, color: C.textPrim, margin: 0 }}>{userProfile.username}</h4>
            <p style={{ fontSize: 14, color: C.textSec, margin: 0, textAlign: 'center' }}>{userProfile.about}</p>

            {/* Counts */}
            <div style={{ display: 'flex', gap: 32, marginTop: 4 }}>
              {[['Followers', userProfile.followers?.length || 0], ['Following', userProfile.following?.length || 0]].map(([label, count]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 18, fontWeight: 600, color: C.textPrim, margin: 0 }}>{count}</p>
                  <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              {userProfile._id === userId ? (
                <>
                  <button
                    onClick={async () => await logout()}
                    onMouseEnter={() => setHoveredBtn('logout')}
                    onMouseLeave={() => setHoveredBtn(null)}
                    style={btnDanger}
                  >Logout</button>
                  <button
                    onClick={() => setIsUpdating(true)}
                    onMouseEnter={() => setHoveredBtn('edit')}
                    onMouseLeave={() => setHoveredBtn(null)}
                    style={btnPrimary(hoveredBtn === 'edit')}
                  >Edit profile</button>
                </>
              ) : (
                localStorage.getItem('following').includes(userProfile._id) ? (
                  <>
                    <button
                      onClick={() => handleUnFollow(userProfile._id)}
                      style={btnDanger}
                    >Unfollow</button>
                    <button
                      onMouseEnter={() => setHoveredBtn('msg')}
                      onMouseLeave={() => setHoveredBtn(null)}
                      style={btnPrimary(hoveredBtn === 'msg')}
                    >Message</button>
                  </>
                ) : (
                  <button
                    onClick={() => handleFollow(userProfile._id)}
                    onMouseEnter={() => setHoveredBtn('follow')}
                    onMouseLeave={() => setHoveredBtn(null)}
                    style={btnPrimary(hoveredBtn === 'follow')}
                  >Follow</button>
                )
              )}
            </div>
          </div>
        )}

        {/* Edit card */}
        {isUpdating && (
          <div style={{
            background: C.cardBg,
            border: `0.5px solid ${C.borderDef}`,
            borderRadius: 14, padding: '24px',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: C.textPrim, margin: 0 }}>Edit profile</h3>

            {[
              { label: 'Profile image URL', value: updateProfilePic, setter: setUpdateProfilePic, key: 'pic' },
              { label: 'Username', value: updateProfileUsername, setter: setUpdateProfileUsername, key: 'uname' },
              { label: 'About', value: updateProfileAbout, setter: setUpdateProfileAbout, key: 'about' },
            ].map(({ label, value, setter, key }) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, color: C.textMuted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                <input
                  type="text"
                  value={value}
                  style={inputStyle(focusedField === key)}
                  onFocus={() => setFocusedField(key)}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setter(e.target.value)}
                />
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setIsUpdating(false)}
                style={{ ...btnDanger, flex: 1 }}
              >Cancel</button>
              <button
                onClick={handleUpdate}
                onMouseEnter={() => setHoveredBtn('update')}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{ ...btnPrimary(hoveredBtn === 'update'), flex: 1 }}
              >Update</button>
            </div>
          </div>
        )}

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {posts.filter(post => post.userId === userProfile._id).map((post) => (
            <div key={post._id} style={{
              background: C.cardBg,
              border: `0.5px solid ${C.borderDef}`,
              borderRadius: 12, overflow: 'hidden',
            }}>
              {/* Post top */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={post.userPic} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: C.textPrim }}>{post.userName}</span>
                </div>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  style={{ background: 'transparent', color: '#E24B4A', border: '0.5px solid #E24B4A', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}
                >Delete</button>
              </div>

              {/* Media */}
              {post.fileType === 'photo'
                ? <img src={post.file} alt="" style={{ width: '100%', display: 'block' }} />
                : <video controls autoPlay muted style={{ width: '100%', display: 'block' }}><source src={post.file} /></video>
              }

              {/* Reactions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', borderTop: `0.5px solid ${C.borderDef}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {post.likes.includes(localStorage.getItem('userId'))
                    ? <AiTwotoneHeart style={{ fontSize: 20, color: '#E24B4A', cursor: 'pointer' }} onClick={() => handleUnLike(localStorage.getItem('userId'), post._id)} />
                    : <AiOutlineHeart style={{ fontSize: 20, color: C.textSec, cursor: 'pointer' }} onClick={() => handleLike(localStorage.getItem('userId'), post._id)} />
                  }
                  <span style={{ fontSize: 13, color: C.textSec }}>{post.likes.length}</span>
                </div>
                <BiCommentDetail style={{ fontSize: 18, color: C.textSec, cursor: 'pointer' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                  <FaGlobeAmericas style={{ fontSize: 14, color: C.textMuted }} />
                  <span style={{ fontSize: 12, color: C.textMuted }}>{post.location}</span>
                </div>
              </div>

              {/* Description */}
              <div style={{ padding: '4px 16px 12px' }}>
                <p style={{ fontSize: 14, color: C.textSec, margin: 0 }}>
                  <span style={{ fontWeight: 600, color: C.textPrim }}>{post.userName}</span>
                  &nbsp;{post.description}
                </p>
              </div>

              {/* Comments */}
              <div style={{ borderTop: `0.5px solid ${C.borderDef}`, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    onChange={(e) => setComment(e.target.value)}
                    style={{
                      flex: 1, background: C.elevated,
                      border: `0.5px solid ${C.borderDef}`,
                      borderRadius: 8, padding: '8px 12px',
                      color: C.textPrim, fontSize: 13, outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => handleComment(post._id, localStorage.getItem('username'))}
                    disabled={comment.length === 0}
                    style={{
                      background: comment.length === 0 ? C.elevated : C.deepBlue,
                      color: comment.length === 0 ? C.textMuted : C.iceBlue,
                      border: `0.5px solid ${comment.length === 0 ? C.borderDef : C.borderAcc}`,
                      borderRadius: 8, padding: '8px 14px',
                      fontSize: 13, cursor: comment.length === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >Post</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {post.comments.map((c, i) => (
                    <p key={i} style={{ fontSize: 13, color: C.textSec, margin: 0 }}>
                      <b style={{ color: C.textPrim }}>{c[0]}</b> {c[1]}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;