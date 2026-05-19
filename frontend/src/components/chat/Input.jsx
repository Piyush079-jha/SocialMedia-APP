import React, { useContext, useState } from 'react'
import { BiImageAdd } from 'react-icons/bi'
import { GeneralContext } from '../../context/GeneralContextProvider'
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase';

const Input = () => {

  const { socket, chatData } = useContext(GeneralContext);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState();
  const userId = localStorage.getItem('userId');

  const handleSend = async () => {
    if (file) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => { setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100); },
        (error) => { console.log(error); },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            try {
              let date = new Date();
              await socket.emit('new-message', { chatId: chatData.chatId, id: uuid(), text, file: downloadURL, senderId: userId, date });
              setUploadProgress();
              setText('');
              setFile(null);
            } catch (err) { console.log(err); }
          });
        }
      );
    } else {
      let date = new Date();
      await socket.emit('new-message', { chatId: chatData.chatId, id: uuid(), text, file: '', senderId: userId, date });
      setText('');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '14px 20px',
      background: '#0f1525',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>

      <input
        type="text"
        placeholder="Write a message..."
        onChange={e => setText(e.target.value)}
        value={text}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        style={{
          flex: 1,
          background: '#151d30',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '11px 16px',
          fontSize: '13.5px',
          color: '#ffffff',
          fontFamily: 'inherit',
          outline: 'none',
          letterSpacing: '0.01em',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(74,123,255,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input type="file" style={{ display: 'none' }} id="file" onChange={e => setFile(e.target.files[0])} />
        <label
          htmlFor="file"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'transparent',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(74,123,255,0.5)'; e.currentTarget.style.background = 'rgba(74,123,255,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <BiImageAdd size={19} color="#8892aa" />
          {uploadProgress && (
            <span style={{ fontSize: '11px', color: '#4a7bff', fontWeight: 600 }}>
              {Math.floor(uploadProgress)}%
            </span>
          )}
        </label>

        <button
          onClick={handleSend}
          style={{
            height: '38px',
            padding: '0 22px',
            background: 'linear-gradient(135deg, #4a7bff, #2d5ce8)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.02em',
            boxShadow: '0 4px 20px rgba(74,123,255,0.3)',
            transition: 'opacity 0.2s, transform 0.1s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Input;