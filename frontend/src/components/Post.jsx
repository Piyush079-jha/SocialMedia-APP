import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineHeart, AiTwotoneHeart } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { FaGlobeAmericas } from 'react-icons/fa';
import { GeneralContext } from '../context/GeneralContextProvider';
import axios from 'axios';

const C = {
  cardBg:    '#0f1525',
  elevated:  '#151d30',
  textPrim:  '#ffffff',
  textSec:   '#8892aa',
  textMuted: '#3d4a63',
  blue:      '#4a7bff',
  borderDef: 'rgba(255,255,255,0.06)',
  borderAcc: 'rgba(74,123,255,0.5)',
};

const Post = () => {
  const { socket } = useContext(GeneralContext);
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetchAllPosts');
      setPosts(response.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    socket.on('post-deleted', ({ posts }) => setPosts(posts));
  }, [socket]);

  const handleLike      = (userId, postId) => socket.emit('postLiked',    { userId, postId });
  const handleUnLike    = (userId, postId) => socket.emit('postUnLiked',  { userId, postId });
  const handleComment   = (postId, username) => { socket.emit('makeComment', { postId, username, comment }); setComment(''); };
  const handleDeletePost = (postId) => socket.emit('delete-post', { postId });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {posts.map((post) => (
        <div key={post._id} style={{
          background: C.cardBg,
          border: `1px solid ${C.borderDef}`,
          borderRadius: '16px',
          overflow: 'hidden',
        }}>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={post.userPic} alt="" style={{
                width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover',
                border: '1.5px solid rgba(74,123,255,0.3)',
              }} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: C.textPrim, letterSpacing: '0.01em' }}>
                {post.userName}
              </span>
            </div>
            {post.userId === userId && (
              <button
                onClick={() => handleDeletePost(post._id)}
                style={{
                  background: 'rgba(226,75,74,0.08)',
                  color: '#e24b4a',
                  border: '1px solid rgba(226,75,74,0.25)',
                  borderRadius: '8px', padding: '4px 12px',
                  fontSize: '12px', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(226,75,74,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(226,75,74,0.08)'}
              >
                Delete
              </button>
            )}
          </div>

          {/* Media */}
          {post.fileType === 'photo'
            ? <img src={post.file} alt="" style={{ width: '100%', display: 'block' }} />
            : <video controls autoPlay muted style={{ width: '100%', display: 'block' }}><source src={post.file} /></video>
          }

          {/* Reactions */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '12px 18px',
            borderTop: `1px solid ${C.borderDef}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {post.likes.includes(userId)
                ? <AiTwotoneHeart style={{ fontSize: 22, color: '#e24b4a', cursor: 'pointer' }} onClick={() => handleUnLike(userId, post._id)} />
                : <AiOutlineHeart style={{ fontSize: 22, color: C.textSec, cursor: 'pointer' }} onClick={() => handleLike(userId, post._id)} />
              }
              <span style={{ fontSize: '13px', color: C.textSec }}>{post.likes.length}</span>
            </div>
            <BiCommentDetail style={{ fontSize: 20, color: C.textSec, cursor: 'pointer' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
              <FaGlobeAmericas style={{ fontSize: 12, color: C.textMuted }} />
              <span style={{ fontSize: '12px', color: C.textMuted }}>{post.location}</span>
            </div>
          </div>

          {/* Description */}
          <div style={{ padding: '2px 18px 14px' }}>
            <p style={{ fontSize: '13.5px', color: C.textSec, margin: 0, lineHeight: 1.6 }}>
              <span style={{ fontWeight: 600, color: C.textPrim }}>{post.userName} </span>
              {post.description}
            </p>
          </div>

          {/* Comments */}
          <div style={{ borderTop: `1px solid ${C.borderDef}`, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Add a comment..."
                onChange={(e) => setComment(e.target.value)}
                style={{
                  flex: 1, background: C.elevated,
                  border: `1px solid ${C.borderDef}`,
                  borderRadius: '10px', padding: '9px 13px',
                  color: C.textPrim, fontSize: '13px', outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(74,123,255,0.5)'}
                onBlur={e => e.target.style.borderColor = C.borderDef}
              />
              <button
                onClick={() => handleComment(post._id, localStorage.getItem('username'))}
                disabled={comment.length === 0}
                style={{
                  background: comment.length === 0 ? C.elevated : 'linear-gradient(135deg, #4a7bff, #2d5ce8)',
                  color: comment.length === 0 ? C.textMuted : '#ffffff',
                  border: `1px solid ${comment.length === 0 ? C.borderDef : 'transparent'}`,
                  borderRadius: '10px', padding: '9px 16px',
                  fontSize: '13px', cursor: comment.length === 0 ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', fontWeight: 600,
                  transition: 'all 0.2s',
                  boxShadow: comment.length > 0 ? '0 4px 14px rgba(74,123,255,0.3)' : 'none',
                }}
              >
                Post
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {post.comments.map((c, i) => (
                <p key={i} style={{ fontSize: '13px', color: C.textSec, margin: 0 }}>
                  <b style={{ color: C.textPrim, fontWeight: 600 }}>{c[0]}</b> {c[1]}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Post;