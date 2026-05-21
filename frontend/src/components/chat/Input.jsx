import React, { useContext, useRef, useState, useCallback } from 'react';
import { BiImageAdd } from 'react-icons/bi';
import { GeneralContext } from '../../context/GeneralContextProvider';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase';

const MAX_FILE_SIZE_MB = 10;

const Input = () => {
  const { socket, chatData } = useContext(GeneralContext);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const userId = localStorage.getItem('userId');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const clearFile = useCallback(() => {
    setFile(null);
    setPreview(null);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const emitMessage = useCallback(async ({ fileUrl = '' } = {}) => {
    const date = new Date();
    await socket.emit('new-message', {
      chatId: chatData.chatId,
      id: uuid(),
      text: text.trim(),
      file: fileUrl,
      senderId: userId,
      date,
    });
    setText('');
    clearFile();
    setIsSending(false);
  }, [socket, chatData.chatId, text, userId, clearFile]);

  const handleSend = useCallback(async () => {
    const hasContent = text.trim() || file;
    if (!hasContent || isSending) return;

    setIsSending(true);

    if (file) {
      const fileRef = storageRef(storage, `chat/${uuid()}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.floor(pct));
        },
        (error) => {
          console.error('Upload failed:', error);
          setIsSending(false);
          setUploadProgress(null);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await emitMessage({ fileUrl: downloadURL });
          setUploadProgress(null);
        }
      );
    } else {
      await emitMessage();
    }
  }, [text, file, isSending, emitMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = (text.trim() || file) && !isSending;

  return (
    <div style={{
      flexShrink: 0,
      background: '#0f1225',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '0',
    }}>
      {/* File preview strip */}
      {preview && (
        <div style={{
          padding: '10px 16px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={preview}
              alt="preview"
              style={{
                width: '52px',
                height: '52px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid rgba(109,86,255,0.25)',
              }}
            />
            <button
              onClick={clearFile}
              aria-label="Remove attachment"
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#6d56ff',
                border: 'none',
                color: '#fff',
                fontSize: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
          {uploadProgress !== null && (
            <div style={{
              flex: 1,
              height: '3px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '99px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${uploadProgress}%`,
                background: 'linear-gradient(90deg, #6d56ff, #4a35d4)',
                transition: 'width 0.2s',
                borderRadius: '99px',
              }} />
            </div>
          )}
        </div>
      )}

      {/* Input row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
      }}>
        {/* Text input */}
        <textarea
          rows={1}
          placeholder="Write a message..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            padding: '10px 15px',
            fontSize: '13.5px',
            color: '#e8e8ff',
            fontFamily: 'inherit',
            outline: 'none',
            letterSpacing: '0.01em',
            resize: 'none',
            lineHeight: 1.5,
            maxHeight: '120px',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onFocus={e => {
            e.target.style.borderColor = 'rgba(109,86,255,0.4)';
            e.target.style.background = 'rgba(109,86,255,0.04)';
          }}
          onBlur={e => {
            e.target.style.borderColor = 'rgba(255,255,255,0.07)';
            e.target.style.background = 'rgba(255,255,255,0.04)';
          }}
        />

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* File picker */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="chat-file"
            onChange={handleFileChange}
          />
          <label
            htmlFor="chat-file"
            title="Attach image"
            style={{
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.07)',
              background: 'transparent',
              transition: 'all 0.18s',
              color: '#5a6280',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(109,86,255,0.4)';
              e.currentTarget.style.background = 'rgba(109,86,255,0.08)';
              e.currentTarget.style.color = '#9d8aff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#5a6280';
            }}
          >
            <BiImageAdd size={18} />
          </label>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            title="Send message (Enter)"
            style={{
              height: '38px',
              padding: '0 20px',
              background: canSend
                ? 'linear-gradient(135deg, #6d56ff 0%, #4a35d4 100%)'
                : 'rgba(255,255,255,0.05)',
              color: canSend ? '#ffffff' : '#3a4260',
              border: 'none',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: canSend ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              letterSpacing: '0.03em',
              boxShadow: canSend ? '0 4px 20px rgba(109,86,255,0.3)' : 'none',
              transition: 'all 0.18s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (canSend) e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            onMouseDown={e => { if (canSend) e.currentTarget.style.transform = 'scale(0.96)'; }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {isSending ? '…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Input;