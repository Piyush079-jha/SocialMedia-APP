import React, { useContext, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, Video, MapPin, FileText, Upload, CheckCircle } from 'lucide-react';
import { GeneralContext } from '../context/GeneralContextProvider';
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase.js';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const STEPS = ['Choose type', 'Upload file', 'Add details'];

const CreatePost = () => {
  const { isCreatPostOpen, setIsCreatePostOpen } = useContext(GeneralContext);
  const [step, setStep] = useState(0);
  const [postType, setPostType] = useState('photo');
  const [postDescription, setPostDescription] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [postFile, setPostFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [done, setDone] = useState(false);

  const reset = useCallback(() => {
    setStep(0); setPostType('photo'); setPostDescription('');
    setPostLocation(''); setPostFile(null); setPreviewUrl('');
    setUploadProgress(null); setError(''); setIsSending(false); setDone(false);
  }, []);

  const handleClose = useCallback(() => { reset(); setIsCreatePostOpen(false); }, [reset, setIsCreatePostOpen]);

  useEffect(() => {
    if (!isCreatPostOpen) return;
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isCreatPostOpen, handleClose]);

  const handleFile = (file) => {
    if (!file) return;
    setError('');
    if (file.size > MAX_FILE_SIZE) { setError('File too large — max 50MB'); return; }
    const isImg = file.type.startsWith('image/');
    const isVid = file.type.startsWith('video/');
    if (postType === 'photo' && !isImg) { setError('Please select an image'); return; }
    if (postType === 'video' && !isVid) { setError('Please select a video'); return; }
    setPostFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStep(2);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleUpload = async () => {
    if (isSending || !postFile) return;
    setError(''); setIsSending(true);
    const storageRef = ref(storage, `posts/${uuidv4()}`);
    const task = uploadBytesResumable(storageRef, postFile);
    task.on('state_changed',
      (snap) => setUploadProgress((snap.bytesTransferred / snap.totalBytes) * 100),
      (err) => { console.error(err); setError('Upload failed. Try again.'); setIsSending(false); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        try {
          await axios.post('http://localhost:6001/createPost', {
            userId: localStorage.getItem('userId'),
            userName: localStorage.getItem('username'),
            userPic: localStorage.getItem('profilePic'),
            fileType: postType, file: url,
            description: postDescription, location: postLocation, comments: [],
          });
          setDone(true);
          toast.success('Post shared! 🎉');
          setTimeout(handleClose, 1500);
        } catch (err) {
          setError('Failed to save post.'); setIsSending(false);
        }
      }
    );
  };

  if (!isCreatPostOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      role="dialog" aria-modal="true" aria-label="Create post"
      onClick={handleClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 500, overflow: 'hidden', boxShadow: 'var(--shadow-elevated)' }}
      >
        {/* Header */}
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Create Post</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '3px 0 0' }}>Step {step + 1} of 3 — {STEPS[step]}</p>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleClose} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </motion.button>
        </div>

        {/* Progress steps */}
        <div style={{ padding: '14px 22px 0', display: 'flex', gap: 6 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i <= step ? 'linear-gradient(90deg, #8B5CF6, #EC4899)' : 'var(--bg-elevated)', transition: 'background 0.3s' }} />
          ))}
        </div>

        <div style={{ padding: '22px' }}>
          <AnimatePresence mode="wait">
            {/* Step 0: Choose type */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>What would you like to share?</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { type: 'photo', icon: Image, label: 'Photo', desc: 'JPG, PNG, WEBP', color: '#8B5CF6' },
                    { type: 'video', icon: Video, label: 'Video', desc: 'MP4, MOV, WEBM', color: '#EC4899' },
                  ].map(({ type, icon: Icon, label, desc, color }) => (
                    <motion.button
                      key={type} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setPostType(type); setStep(1); }}
                      style={{
                        background: postType === type ? `rgba(${type === 'photo' ? '139,92,246' : '236,72,153'},0.1)` : 'var(--bg-elevated)',
                        border: `1px solid ${postType === type ? color : 'var(--border)'}`,
                        borderRadius: 'var(--radius-lg)', padding: '24px 16px',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: 16, background: `rgba(${type === 'photo' ? '139,92,246' : '236,72,153'},0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={24} color={color} />
                      </div>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{label}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '3px 0 0' }}>{desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: Upload file */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <div
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  style={{
                    border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-lg)', padding: '48px 24px',
                    textAlign: 'center', transition: 'all 0.2s',
                    background: isDragging ? 'rgba(139,92,246,0.05)' : 'var(--bg-elevated)',
                    cursor: 'pointer',
                  }}
                  onClick={() => document.getElementById('post-file-input').click()}
                >
                  <input id="post-file-input" type="file" accept={postType === 'photo' ? 'image/*' : 'video/*'} onChange={e => handleFile(e.target.files[0])} style={{ display: 'none' }} />
                  <motion.div animate={{ y: isDragging ? -8 : 0 }} transition={{ duration: 0.2 }}>
                    <Upload size={40} color="var(--text-muted)" style={{ marginBottom: 12 }} />
                  </motion.div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                    {isDragging ? 'Drop it here!' : `Drag & drop your ${postType}`}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>or click to browse files</p>
                </div>
                {error && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 10, textAlign: 'center' }}>{error}</p>}
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(0)} style={{ width: '100%', marginTop: 12, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13, padding: '8px 0' }}>
                  ← Change type
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Details + confirm */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                {/* Preview */}
                {previewUrl && (
                  <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 16, background: '#000', maxHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {postType === 'photo' ? (
                      <img src={previewUrl} alt="" style={{ width: '100%', maxHeight: 220, objectFit: 'cover' }} />
                    ) : (
                      <video src={previewUrl} controls muted style={{ width: '100%', maxHeight: 220 }} />
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <FileText size={16} color="var(--text-muted)" style={{ marginTop: 12, flexShrink: 0 }} />
                    <textarea
                      placeholder="Write a caption…"
                      value={postDescription}
                      onChange={e => setPostDescription(e.target.value)}
                      rows={3}
                      className="input-premium"
                      style={{ resize: 'none', lineHeight: 1.6 }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <MapPin size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                    <input className="input-premium" placeholder="Add location…" value={postLocation} onChange={e => setPostLocation(e.target.value)} />
                  </div>
                </div>

                {error && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 8 }}>{error}</p>}

                {uploadProgress !== null && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ height: 4, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                      <motion.div
                        style={{ height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', borderRadius: 4 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ ease: 'linear', duration: 0.2 }}
                      />
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--accent)', textAlign: 'right', marginTop: 6 }}>
                      {done ? '✓ Done!' : `${Math.round(uploadProgress)}% uploading…`}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={() => setStep(1)} style={{ flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                    onClick={handleUpload}
                    disabled={isSending || !postFile}
                    className="btn-gradient"
                    style={{ flex: 2, borderRadius: 10, padding: 12, fontSize: 14, opacity: isSending || !postFile ? 0.5 : 1, cursor: isSending || !postFile ? 'not-allowed' : 'pointer' }}
                  >
                    {done ? <><CheckCircle size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Shared!</> : isSending ? 'Uploading…' : 'Share post'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreatePost;