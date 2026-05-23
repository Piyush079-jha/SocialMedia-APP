// Login.jsx
import React, { useContext, useState } from 'react';
import { AuthenticationContext } from '../context/AuthenticationContextProvider';

const C = {
  cardBg:    '#111111',
  elevated:  '#1a1a1a',
  textPrim:  '#FFFFFF',
  textSec:   '#A0A0A0',
  textMuted: '#6E6E6E',
  iceBlue:   '#B2D3E6',
  deepBlue:  '#1A3A4A',
  borderDef: '#1F1F1F',
  borderHov: '#2A2A2A',
  borderAcc: '#B2D3E6',
};

const Login = ({ setIsLoginBox }) => {
  const { setEmail, setPassword, login } = useContext(AuthenticationContext);
  const [focusedField, setFocusedField] = useState(null);
  const [isSending, setIsSending]       = useState(false);
  const [emailVal, setEmailVal]         = useState('');
  const [passVal, setPassVal]           = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    try {
      await login();
    } finally {
      setIsSending(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%',
    background: C.elevated,
    border: `0.5px solid ${focusedField === field ? C.borderAcc : C.borderDef}`,
    borderRadius: 8,
    padding: '12px 14px',
    color: C.textPrim,
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  });

  return (
    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: C.textPrim, margin: 0, letterSpacing: '-0.3px' }}>Login</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 12, color: C.textMuted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Email address
        </label>
        <input
          type="email"
          placeholder="name@example.com"
          value={emailVal}
          autoComplete="email"
          style={inputStyle('email')}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => { setEmailVal(e.target.value); setEmail(e.target.value); }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 12, color: C.textMuted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={passVal}
          autoComplete="current-password"
          style={inputStyle('password')}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => { setPassVal(e.target.value); setPassword(e.target.value); }}
        />
      </div>

      <button
        type="submit"
        disabled={isSending}
        style={{
          background: C.deepBlue,
          color: C.iceBlue,
          border: `0.5px solid ${C.borderAcc}`,
          borderRadius: 8,
          padding: '12px',
          fontSize: 14,
          fontWeight: 600,
          cursor: isSending ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s ease, color 0.2s ease, opacity 0.2s',
          letterSpacing: '0.02em',
          opacity: isSending ? 0.6 : 1,
        }}
        onMouseEnter={e => { if (!isSending) { e.currentTarget.style.background = C.iceBlue; e.currentTarget.style.color = C.deepBlue; } }}
        onMouseLeave={e => { e.currentTarget.style.background = C.deepBlue; e.currentTarget.style.color = C.iceBlue; }}
      >
        {isSending ? 'Signing in…' : 'Sign in'}
      </button>

      <p style={{ fontSize: 13, color: C.textMuted, margin: 0, textAlign: 'center' }}>
        Not registered?{' '}
        <span
          onClick={() => setIsLoginBox(false)}
          style={{ color: C.iceBlue, cursor: 'pointer', fontWeight: 500 }}
        >
          Register
        </span>
      </p>
    </form>
  );
};

export default Login;