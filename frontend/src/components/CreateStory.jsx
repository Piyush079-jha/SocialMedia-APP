import React, { useContext, useState } from 'react';
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

const CreateStory = () => {
  const { socket, isCreateStoryOpen, setIsCreateStoryOpen } = useContext(GeneralContext);
  const [storyType, setStoryType] = useState('photo');
  const [storyDescription, setStoryDescription] = useState('');
  const [storyFile, setStoryFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState();
  const [focusedField, setFocusedField] = useState(null);

  if (uploadProgress === 100) {
    setStoryDescription(''); setStoryFile(null);
    setIsCreateStoryOpen(false); setUploadProgress();
  }

  const handleStoryUpload = async (e) => {
    e.preventDefault();
    const storageRef = ref(storage, uuidv4());
    const uploadTask = uploadBytesResumable(storageRef, storyFile);
    uploadTask.on('state_changed',
      (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            await socket.emit('create-new-story', {
              userId: localStorage.getItem('userId'),
              username: localStorage.getItem('username'),
              userPic: localStorage.getItem('profilePic'),
              fileType: storyType, file: downloadURL,
              text: storyDescription,
            });
            setIsCreateStoryOpen(false);
            setStoryDescription(''); setStoryFile(null); setUploadProgress();
          } catch (err) { console.log(err); }
        });
      }
    );
  };

  if (!isCreateStoryOpen) return null;

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

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px',
          borderBottom: `1px solid ${C.borderDef}`,
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: C.textPrim, margin: 0 }}>Add new story</h2>
          <RxCross2
            onClick={() => setIsCreateStoryOpen(false)}
            style={{ fontSize: 18, color: C.textSec, cursor: 'pointer' }}
          />
        </div>

        <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          <select
            onChange={(e) => setStoryType(e.target.value)}
            style={{ ...inputStyle(focusedField === 'type'), cursor: 'pointer' }}
            onFocus={() => setFocusedField('type')}
            onBlur={() => setFocusedField(null)}
          >
            <option value="photo">Photo</option>
            <option value="video">Video</option>
          </select>

          <div style={{
            background: C.elevated,
            border: `1px dashed ${C.borderHov}`,
            borderRadius: '10px', padding: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <input
              type="file"
              onChange={(e) => setStoryFile(e.target.files[0])}
              style={{ color: C.textSec, fontSize: '13px', cursor: 'pointer' }}
            />
          </div>

          <input
            type="text"
            placeholder="Story text / caption"
            value={storyDescription}
            style={inputStyle(focusedField === 'desc')}
            onFocus={() => setFocusedField('desc')}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => setStoryDescription(e.target.value)}
          />

          {uploadProgress ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ height: '3px', background: C.borderDef, borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${uploadProgress}%`,
                  background: 'linear-gradient(90deg, #4a7bff, #2d5ce8)',
                  borderRadius: '2px', transition: 'width 0.2s',
                }} />
              </div>
              <span style={{ fontSize: '12px', color: C.blue, textAlign: 'right' }}>{Math.round(uploadProgress)}%</span>
            </div>
          ) : (
            <button
              onClick={handleStoryUpload}
              style={{
                background: 'linear-gradient(135deg, #4a7bff, #2d5ce8)',
                color: '#ffffff', border: 'none',
                borderRadius: '10px', padding: '12px',
                fontSize: '13.5px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
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

export default CreateStory;