// CreateStory.jsx
import React, { useContext, useEffect, useState } from 'react';
import { GeneralContext } from '../context/GeneralContextProvider';
import { RxCross2 } from 'react-icons/rx';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase.js';
import { v4 as uuidv4 } from 'uuid';

const C = {
  cardBg:    '#0f1525',
  elevated:  '#151d30',
  textPrim:  '#ffffff',
  textSec:   '#8892aa',
  textMuted: '#3d4a63',
  blue:      '#4a7bff',
  borderDef: 'rgba(255,255,255,0.06)',
  borderHov: 'rgba(255,255,255,0.12)',
  borderAcc: 'rgba(74,123,255,0.5)',
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const inputStyle = (focused) => ({
  width: '100%',
  background: C.elevated,
  border: `1px solid ${focused ? C.borderAcc : C.borderDef}`,
  borderRadius: '10px',
  padding: '11px 14px',
  color: C.textPrim,
  fontSize: '13.5px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
});

const CreateStory = () => {
  const { socket, isCreateStoryOpen, setIsCreateStoryOpen } = useContext(GeneralContext);
  const [storyType, setStoryType]           = useState('photo');
  const [storyDescription, setStoryDescription] = useState('');
  const [storyFile, setStoryFile]           = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [focusedField, setFocusedField]     = useState(null);
  const [error, setError]                   = useState('');
  const [isSending, setIsSending]           = useState(false);

  // Reset after successful upload
  useEffect(() => {
    if (uploadProgress === 100) {
      const timer = setTimeout(() => {
        setStoryDescription('');
        setStoryFile(null);
        setUploadProgress(null);
        setIsSending(false);
        setIsCreateStoryOpen(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [uploadProgress, setIsCreateStoryOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isCreateStoryOpen) return;
    const handler = (e) => { if (e.key === 'Escape') setIsCreateStoryOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isCreateStoryOpen, setIsCreateStoryOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError('');
    if (file.size > MAX_FILE_SIZE) { setError('File too large. Maximum size is 50MB.'); return; }
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (storyType === 'photo' && !isImage) { setError('Please select an image file.'); return; }
    if (storyType === 'video' && !isVideo) { setError('Please select a video file.'); return; }
    setStoryFile(file);
  };

  const handleStoryUpload = async (e) => {
    e.preventDefault();
    if (isSending || !storyFile) return;
    setError('');
    setIsSending(true);

    const storageRef = ref(storage, `stories/${uuidv4()}`);
    const uploadTask = uploadBytesResumable(storageRef, storyFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
      (err) => { console.error(err); setError('Upload failed. Please try again.'); setIsSending(false); },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            socket.emit('create-new-story', {
              userId:   localStorage.getItem('userId'),
              username: localStorage.getItem('username'),
              userPic:  localStorage.getItem('profilePic'),
              fileType: storyType,
              file:     downloadURL,
              text:     storyDescription,
            });
          } catch (err) {
            console.error(err);
            setError('Failed to post story. Please try again.');
            setIsSending(false);
          }
        });
      }
    );
  };

  if (!isCreateStoryOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add new story"
      onClick={() => setIsCreateStoryOpen(false)}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.cardBg,
          border: `1px solid ${C.borderHov}`,
          borderRadius: '16px',
          width: '420px',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px',
          borderBottom: `1px solid ${C.borderDef}`,
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: C.textPrim, margin: 0 }}>Add new story</h2>
          <RxCross2
            onClick={() => setIsCreateStoryOpen(false)}
            aria-label="Close"
            style={{ fontSize: 18, color: C.textSec, cursor: 'pointer' }}
          />
        </div>

        {/* Body */}
        <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          <select
            value={storyType}
            onChange={(e) => { setStoryType(e.target.value); setStoryFile(null); setError(''); }}
            style={{ ...inputStyle(focusedField === 'type'), cursor: 'pointer' }}
            onFocus={() => setFocusedField('type')}
            onBlur={() => setFocusedField(null)}
          >
            <option value="photo">Photo</option>
            <option value="video">Video</option>
          </select>

          <div style={{
            background: C.elevated,
            border: `1px dashed ${error ? 'rgba(226,75,74,0.5)' : C.borderHov}`,
            borderRadius: '10px', padding: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '6px',
          }}>
            <input
              type="file"
              accept={storyType === 'photo' ? 'image/*' : 'video/*'}
              onChange={handleFileChange}
              style={{ color: C.textSec, fontSize: '13px', cursor: 'pointer' }}
            />
            {storyFile && (
              <span style={{ fontSize: '11px', color: C.textMuted }}>
                {storyFile.name} ({(storyFile.size / 1024 / 1024).toFixed(1)} MB)
              </span>
            )}
          </div>

          {error && (
            <p style={{ fontSize: '12px', color: '#e24b4a', margin: 0 }}>{error}</p>
          )}

          <input
            type="text"
            placeholder="Story text / caption"
            value={storyDescription}
            style={inputStyle(focusedField === 'desc')}
            onFocus={() => setFocusedField('desc')}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => setStoryDescription(e.target.value)}
          />

          {uploadProgress !== null ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ height: '3px', background: C.borderDef, borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${uploadProgress}%`,
                  background: 'linear-gradient(90deg, #4a7bff, #2d5ce8)',
                  borderRadius: '2px', transition: 'width 0.2s',
                }} />
              </div>
              <span style={{ fontSize: '12px', color: C.blue, textAlign: 'right' }}>
                {Math.round(uploadProgress)}%
              </span>
            </div>
          ) : (
            <button
              onClick={handleStoryUpload}
              disabled={isSending || !storyFile}
              style={{
                background: isSending || !storyFile
                  ? C.elevated
                  : 'linear-gradient(135deg, #4a7bff, #2d5ce8)',
                color: isSending || !storyFile ? C.textMuted : '#ffffff',
                border: `1px solid ${isSending || !storyFile ? C.borderDef : 'transparent'}`,
                borderRadius: '10px', padding: '12px',
                fontSize: '13.5px', fontWeight: 600,
                cursor: isSending || !storyFile ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                boxShadow: isSending || !storyFile ? 'none' : '0 4px 20px rgba(74,123,255,0.3)',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => { if (!isSending && storyFile) e.currentTarget.style.opacity = '0.88'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              Upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateStory;