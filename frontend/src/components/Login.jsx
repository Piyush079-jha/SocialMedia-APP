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
  const [hoveredBtn, setHoveredBtn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login();
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
          style={inputStyle('email')}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 12, color: C.textMuted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          style={inputStyle('password')}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        onMouseEnter={() => setHoveredBtn(true)}
        onMouseLeave={() => setHoveredBtn(false)}
        style={{
          background: hoveredBtn ? C.iceBlue : C.deepBlue,
          color: hoveredBtn ? C.deepBlue : C.iceBlue,
          border: `0.5px solid ${C.borderAcc}`,
          borderRadius: 8,
          padding: '12px',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.2s ease, color 0.2s ease',
          letterSpacing: '0.02em',
        }}
      >
        Sign in
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