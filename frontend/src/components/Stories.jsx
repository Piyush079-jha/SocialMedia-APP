import React, { useContext, useEffect, useState } from 'react';
import { BiPlusCircle } from 'react-icons/bi';
import { GeneralContext } from '../context/GeneralContextProvider';
import axios from 'axios';
import { RxCross2 } from 'react-icons/rx';

const C = {
  cardBg:    '#0f1525',
  elevated:  '#151d30',
  textPrim:  '#ffffff',
  textSec:   '#8892aa',
  textMuted: '#3d4a63',
  blue:      '#4a7bff',
  borderDef: 'rgba(255,255,255,0.06)',
  borderHov: 'rgba(255,255,255,0.12)',
};

const Stories = () => {
  const { socket, setIsCreateStoryOpen } = useContext(GeneralContext);
  const [stories, setStories] = useState([]);
  const [isStoryPlaying, setIsStoryPlaying] = useState(false);
  const [story, setStory] = useState();

  useEffect(() => { fetchStories(); }, []);

  const fetchStories = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetchAllStories');
      setStories(response.data);
    } catch (error) { console.error(error); }
  };

  const handleOpenStory = async (s) => {
    setStory(s);
    await socket.emit('story-played', { storyId: s._id, userId: localStorage.getItem('userId') });
    setIsStoryPlaying(true);
  };

  return (
    <div style={{
      background: C.cardBg,
      border: `1px solid ${C.borderDef}`,
      borderRadius: '16px',
      padding: '18px',
      marginBottom: '14px',
    }}>
      <h3 style={{
        fontSize: '11px', fontWeight: 600, color: C.textMuted,
        margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.1em',
      }}>
        Stories
      </h3>

      {!isStoryPlaying && (
        <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>

          {/* Add story */}
          <div
            onClick={() => setIsCreateStoryOpen(true)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', flexShrink: 0 }}
          >
            <div style={{
              width: '54px', height: '54px', borderRadius: '50%',
              border: `1.5px dashed rgba(74,123,255,0.5)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
              background: C.elevated,
            }}>
              <img
                src={localStorage.getItem('profilePic')} alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
              />
              <BiPlusCircle style={{ position: 'absolute', fontSize: 22, color: '#4a7bff' }} />
            </div>
            <span style={{ fontSize: '11px', color: C.textMuted }}>Add</span>
          </div>

          {/* Stories */}
          {stories && stories
            .filter(s => (
              (localStorage.getItem('following').includes(s.userId) || s.userId === localStorage.getItem('userId'))
              && Math.abs(Math.round((new Date().getTime() - new Date(s.createdAt).getTime()) / (1000 * 60 * 60))) < 24
            ))
            .map((s) => {
              const viewed = s.viewers.includes(localStorage.getItem('userId'));
              return (
                <div
                  key={s._id}
                  onClick={() => handleOpenStory(s)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', flexShrink: 0 }}
                >
                  <div style={{
                    width: '54px', height: '54px', borderRadius: '50%',
                    padding: '2px',
                    background: viewed
                      ? 'transparent'
                      : 'linear-gradient(135deg, #4a7bff, #2d5ce8)',
                    border: viewed ? `1.5px solid ${C.borderHov}` : 'none',
                  }}>
                    <img
                      src={s.userPic} alt=""
                      style={{
                        width: '100%', height: '100%',
                        borderRadius: '50%', objectFit: 'cover',
                        border: `2px solid ${C.cardBg}`,
                      }}
                    />
                  </div>
                  <span style={{
                    fontSize: '11px', color: C.textSec,
                    maxWidth: '54px', textAlign: 'center',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {s.username}
                  </span>
                </div>
              );
            })
          }
        </div>
      )}

      {/* Story player */}
      {story && isStoryPlaying && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.92)',
          zIndex: 400,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: C.cardBg,
            border: `1px solid ${C.borderHov}`,
            borderRadius: '18px',
            width: '340px', maxHeight: '88vh',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: `1px solid ${C.borderDef}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={story.userPic} alt="" style={{
                  width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover',
                  border: '1.5px solid rgba(74,123,255,0.5)',
                }} />
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: C.textPrim }}>{story.username}</span>
              </div>
              <RxCross2
                onClick={() => setIsStoryPlaying(false)}
                style={{ fontSize: 18, color: C.textSec, cursor: 'pointer' }}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {story.fileType === 'photo'
                ? <img src={story.file} alt="" style={{ width: '100%', objectFit: 'cover' }} />
                : <video controls autoPlay muted style={{ width: '100%' }}><source src={story.file} /></video>
              }
              {story.text && (
                <p style={{ fontSize: '13.5px', color: C.textSec, padding: '14px 18px', margin: 0, lineHeight: 1.6 }}>
                  {story.text}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;