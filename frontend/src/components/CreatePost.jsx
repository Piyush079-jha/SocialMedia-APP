import React, { useContext, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { GeneralContext } from '../context/GeneralContextProvider';
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase.js';
import { v4 as uuidv4 } from 'uuid';

const C = {
  pageBg:    '#0a0e1a',
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

const CreatePost = () => {
  const { isCreatPostOpen, setIsCreatePostOpen } = useContext(GeneralContext);
  const [postType, setPostType] = useState('photo');
  const [postDescription, setPostDescription] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [postFile, setPostFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState();
  const [focusedField, setFocusedField] = useState(null);

  if (uploadProgress === 100) {
    setPostDescription(''); setPostLocation('');
    setPostFile(null); setIsCreatePostOpen(false);
    setUploadProgress();
  }

  const handlePostUpload = async (e) => {
    e.preventDefault();
    const storageRef = ref(storage, uuidv4());
    const uploadTask = uploadBytesResumable(storageRef, postFile);
    uploadTask.on('state_changed',
      (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            const inputs = {
              userId: localStorage.getItem('userId'),
              userName: localStorage.getItem('username'),
              userPic: localStorage.getItem('profilePic'),
              fileType: postType, file: downloadURL,
              description: postDescription, location: postLocation,
              comments: { 'New user': 'This is my first comment' },
            };
            await axios.post('http://localhost:6001/createPost', inputs);
          } catch (err) { console.log(err); }
        });
      }
    );
  };

  if (!isCreatPostOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(6px)',
      zIndex: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: C.cardBg,
        border: `1px solid ${C.borderHov}`,
        borderRadius: '16px',
        width: '420px',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px',
          borderBottom: `1px solid ${C.borderDef}`,
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: C.textPrim, margin: 0, letterSpacing: '0.01em' }}>
            Create post
          </h2>
          <RxCross2
            onClick={() => setIsCreatePostOpen(false)}
            style={{ fontSize: 18, color: C.textSec, cursor: 'pointer' }}
          />
        </div>

        {/* Body */}
        <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          <select
            onChange={(e) => setPostType(e.target.value)}
            style={{ ...inputStyle(focusedField === 'type'), cursor: 'pointer', background: C.elevated }}
            onFocus={() => setFocusedField('type')}
            onBlur={() => setFocusedField(null)}
          >
            <option value="photo">Photo</option>
            <option value="video">Video</option>
          </select>

          <div style={{
            background: C.elevated,
            border: `1px dashed ${C.borderHov}`,
            borderRadius: '10px',
            padding: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <input
              type="file"
              onChange={(e) => setPostFile(e.target.files[0])}
              style={{ color: C.textSec, fontSize: '13px', cursor: 'pointer' }}
            />
          </div>

          <input
            type="text"
            placeholder="Description"
            value={postDescription}
            style={inputStyle(focusedField === 'desc')}
            onFocus={() => setFocusedField('desc')}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => setPostDescription(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            value={postLocation}
            style={inputStyle(focusedField === 'loc')}
            onFocus={() => setFocusedField('loc')}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => setPostLocation(e.target.value)}
          />

          {uploadProgress ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                height: '3px',
                background: C.borderDef,
                borderRadius: '2px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${uploadProgress}%`,
                  background: 'linear-gradient(90deg, #4a7bff, #2d5ce8)',
                  borderRadius: '2px',
                  transition: 'width 0.2s',
                }} />
              </div>
              <span style={{ fontSize: '12px', color: C.blue, textAlign: 'right' }}>
                {Math.round(uploadProgress)}%
              </span>
            </div>
          ) : (
            <button
              onClick={handlePostUpload}
              style={{
                background: 'linear-gradient(135deg, #4a7bff, #2d5ce8)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '0.02em',
                boxShadow: '0 4px 20px rgba(74,123,255,0.3)',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;