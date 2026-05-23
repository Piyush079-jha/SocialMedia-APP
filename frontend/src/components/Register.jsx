// Register.jsx
import React, { useContext, useState } from 'react';
import { AuthenticationContext } from '../context/AuthenticationContextProvider';

const C = {
  cardBg:    '#0f1525',
  elevated:  '#151d30',
  textPrim:  '#ffffff',
  textSec:   '#8892aa',
  textMuted: '#3d4a63',
  blue:      '#4a7bff',
  borderDef: 'rgba(255,255,255,0.06)',
  borderAcc: 'rgba(74,123,255,0.5)',
};

const FIELDS = [
  { label: 'Username',      field: 'username', type: 'text',     placeholder: 'your_username',    autoComplete: 'username',         minLength: 3 },
  { label: 'Email address', field: 'email',    type: 'email',    placeholder: 'name@example.com', autoComplete: 'email',            minLength: undefined },
  { label: 'Password',      field: 'password', type: 'password', placeholder: '••••••••',         autoComplete: 'new-password',     minLength: 6 },
];

const Register = ({ setIsLoginBox }) => {
  const { setUsername, setEmail, setPassword, register } = useContext(AuthenticationContext);
  const [focusedField, setFocusedField] = useState(null);
  const [isSending, setIsSending]       = useState(false);
  const [values, setValues]             = useState({ username: '', email: '', password: '' });

  const setters = { username: setUsername, email: setEmail, password: setPassword };

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setters[field](value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    try {
      await register();
    } finally {
      setIsSending(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%',
    background: C.elevated,
    border: `1px solid ${focusedField === field ? C.borderAcc : C.borderDef}`,
    borderRadius: '10px',
    padding: '12px 14px',
    color: C.textPrim,
    fontSize: '13.5px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  });

  const labelStyle = {
    fontSize: '11px',
    color: C.textMuted,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  };

  return (
    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 700, color: C.textPrim, margin: 0, letterSpacing: '-0.5px' }}>
        Create account
      </h2>

      {FIELDS.map(({ label, field, type, placeholder, autoComplete, minLength }) => (
        <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={labelStyle}>{label}</label>
          <input
            type={type}
            placeholder={placeholder}
            value={values[field]}
            autoComplete={autoComplete}
            minLength={minLength}
            required
            style={inputStyle(field)}
            onFocus={() => setFocusedField(field)}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={isSending}
        style={{
          background: 'linear-gradient(135deg, #4a7bff, #2d5ce8)',
          color: '#ffffff', border: 'none',
          borderRadius: '10px', padding: '13px',
          fontSize: '14px', fontWeight: 600,
          cursor: isSending ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          letterSpacing: '0.02em', marginTop: '4px',
          boxShadow: '0 4px 20px rgba(74,123,255,0.35)',
          transition: 'opacity 0.2s',
          opacity: isSending ? 0.6 : 1,
        }}
        onMouseEnter={e => { if (!isSending) e.currentTarget.style.opacity = '0.88'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = isSending ? '0.6' : '1'; }}
      >
        {isSending ? 'Creating account…' : 'Sign up'}
      </button>

      <p style={{ fontSize: '13px', color: C.textMuted, margin: 0, textAlign: 'center' }}>
        Already registered?{' '}
        <span
          onClick={() => setIsLoginBox(true)}
          style={{ color: C.blue, cursor: 'pointer', fontWeight: 600 }}
        >
          Login
        </span>
      </p>
    </form>
  );
};

export default Register;