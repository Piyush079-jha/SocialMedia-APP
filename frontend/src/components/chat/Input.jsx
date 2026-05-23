import React, { useContext, useRef, useState, useCallback, useEffect } from 'react';
import { BiImageAdd } from 'react-icons/bi';
import { Send } from 'lucide-react';
import { GeneralContext } from '../../context/GeneralContextProvider';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase';

const MAX_FILE_SIZE_MB = 10;

const Input = () => {
  const { socket, chatData } = useContext(GeneralContext);
  const [text, setText]               = useState('');
  const [file, setFile]               = useState(null);
  const [preview, setPreview]         = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isSending, setIsSending]     = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef  = useRef(null);
  const userId = localStorage.getItem('userId');

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, [text]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File too large. Max ${MAX_FILE_SIZE_MB}MB.`);
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
    await socket.emit('new-message', {
      chatId: chatData.chatId,
      id: uuid(),
      text: text.trim(),
      file: fileUrl,
      senderId: userId,
      date: new Date(),
    });
    setText('');
    clearFile();
    setIsSending(false);
  }, [socket, chatData?.chatId, text, userId, clearFile]);

  const handleSend = useCallback(async () => {
    const hasContent = text.trim() || file;
    if (!hasContent || isSending) return;
    setIsSending(true);

    if (file) {
      const ref = storageRef(storage, `chat/${uuid()}`);
      const task = uploadBytesResumable(ref, file);
      task.on(
        'state_changed',
        snap => setUploadProgress(Math.floor((snap.bytesTransferred / snap.totalBytes) * 100)),
        err  => { console.error(err); setIsSending(false); setUploadProgress(null); },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          await emitMessage({ fileUrl: url });
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
      paddingBottom: 'var(--safe-bottom, 0px)',
    }}>
      {/* File preview */}
      {preview && (
        <div style={{ padding: '10px 14px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}>
            <img
              src={preview}
              alt="preview"
              style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(109,86,255,0.25)', display: 'block' }}
            />
            <button
              onClick={clearFile}
              aria-label="Remove attachment"
              style={{
                position: 'absolute', top: -5, right: -5,
                width: 18, height: 18, borderRadius: '50%',
                background: '#6d56ff', border: 'none', color: '#fff',
                fontSize: 10, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          </div>
          {uploadProgress !== null && (
            <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${uploadProgress}%`, background: 'linear-gradient(90deg, #6d56ff, #4a35d4)', transition: 'width 0.2s', borderRadius: 99 }} />
            </div>
          )}
        </div>
      )}

      {/* Input row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
        padding: 'clamp(8px, 2vw, 12px) clamp(10px, 3vw, 16px)',
      }}>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Write a message..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
            padding: 'clamp(8px, 2vw, 10px) clamp(10px, 3vw, 15px)',
            fontSize: 'clamp(13px, 3.5vw, 13.5px)',
            color: '#e8e8ff',
            fontFamily: 'inherit',
            outline: 'none',
            resize: 'none',
            lineHeight: 1.5,
            maxHeight: 120,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onFocus={e => {
            e.target.style.borderColor = 'rgba(109,86,255,0.45)';
            e.target.style.background = 'rgba(109,86,255,0.05)';
          }}
          onBlur={e => {
            e.target.style.borderColor = 'rgba(255,255,255,0.07)';
            e.target.style.background = 'rgba(255,255,255,0.04)';
          }}
          aria-label="Message input"
        />

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
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
              width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.07)',
              background: 'transparent', color: '#5a6280',
              transition: 'all 0.18s', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(109,86,255,0.4)'; e.currentTarget.style.background='rgba(109,86,255,0.08)'; e.currentTarget.style.color='#9d8aff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#5a6280'; }}
          >
            <BiImageAdd size={17} />
          </label>

          {/* Send button — icon on mobile, text+icon on desktop */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            title="Send (Enter)"
            style={{
              height: 38,
              padding: '0 clamp(10px, 3vw, 20px)',
              background: canSend ? 'linear-gradient(135deg, #6d56ff, #4a35d4)' : 'rgba(255,255,255,0.05)',
              color: canSend ? '#fff' : '#3a4260',
              border: 'none', borderRadius: 12,
              fontSize: 'clamp(12px, 3vw, 13px)', fontWeight: 600,
              cursor: canSend ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              boxShadow: canSend ? '0 4px 20px rgba(109,86,255,0.3)' : 'none',
              transition: 'all 0.18s', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
              minWidth: 38,
            }}
            onMouseDown={e => { if (canSend) e.currentTarget.style.transform='scale(0.96)'; }}
            onMouseUp={e => { e.currentTarget.style.transform='scale(1)'; }}
            aria-label="Send message"
          >
            {isSending ? '…' : (
              <>
                <Send size={14} />
                <span style={{ display: 'var(--send-text-display, inline)' }}>Send</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 360px) {
          [aria-label="Send message"] span { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Input;