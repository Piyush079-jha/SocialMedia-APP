import React, { useContext } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { GeneralContext } from '../context/GeneralContextProvider';

const C = {
  cardBg:    '#0f1525',
  textPrim:  '#ffffff',
  textSec:   '#8892aa',
  textMuted: '#3d4a63',
  borderDef: 'rgba(255,255,255,0.06)',
  borderHov: 'rgba(255,255,255,0.12)',
};

const Notifications = () => {
  const { isNotificationsOpen, setNotificationsOpen } = useContext(GeneralContext);

  if (!isNotificationsOpen) return null;

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
        width: '380px', maxHeight: '80vh',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px',
          borderBottom: `1px solid ${C.borderDef}`,
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: C.textPrim, margin: 0 }}>Notifications</h2>
          <RxCross2
            onClick={() => setNotificationsOpen(false)}
            style={{ fontSize: 18, color: C.textSec, cursor: 'pointer' }}
          />
        </div>
        <div style={{
          padding: '32px 22px', flex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <p style={{ fontSize: '13.5px', color: C.textMuted, margin: 0 }}>No new notifications</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;