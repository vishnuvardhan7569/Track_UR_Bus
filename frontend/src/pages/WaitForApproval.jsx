import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LOGO_SRC = '/travel.png';
const ESTIMATED_WAIT = 10; // minutes
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function WaitForApproval() {
  const navigate = useNavigate();
  const [approved, setApproved] = useState(false);
  const [progress, setProgress] = useState(0);
  const [highContrast, setHighContrast] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [waited, setWaited] = useState(0);
  const redirectTimeout = useRef(null);
  const intervalRef = useRef(null);

  // Accessibility: focus on greeting
  const greetingRef = useRef(null);
  useEffect(() => { if (greetingRef.current) greetingRef.current.focus(); }, [name]);

  useEffect(() => {
    setName(localStorage.getItem('userName') || '');
    setRole(localStorage.getItem('role') || localStorage.getItem('pendingRole') || 'user');
    setEmail(localStorage.getItem('pendingEmail') || localStorage.getItem('userEmail') || '');
  }, []);

  // Progress bar and waited time
  useEffect(() => {
    if (approved) return;
    const progInt = setInterval(() => {
      setProgress(p => (p < 100 ? p + 2 : 0));
      setWaited(w => w + 5);
    }, 5000);
    return () => clearInterval(progInt);
  }, [approved]);

  // Polling and notification
  useEffect(() => {
    if (approved) {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('You have been approved! Redirecting to your dashboard...');
      }
      redirectTimeout.current = setTimeout(() => {
        localStorage.removeItem('pendingEmail');
        fetch(`${API_BASE_URL}/auth/check-status?email=${encodeURIComponent(email)}`)
          .then(res => res.json())
          .then(data => {
            if (data.role === 'driver') navigate('/driver/dashboard');
            else if (data.role === 'admin') navigate('/admin/dashboard');
            else navigate('/dashboard');
          });
      }, 2000);
      return () => clearTimeout(redirectTimeout.current);
    }
    if (!email) return;
    intervalRef.current = setInterval(async () => {
      try {
        if (!localStorage.getItem('token') && !localStorage.getItem('pendingEmail')) {
          navigate('/login');
          return;
        }
        const res = await fetch(`${API_BASE_URL}/auth/check-status?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'approved') {
            setApproved(true);
            clearInterval(intervalRef.current);
          }
        }
      } catch {}
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [navigate, approved, email]);

  // Request browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // High contrast mode
  const mainBg = highContrast ? '#000' : 'linear-gradient(120deg, #f8fafc 0%, #e3f0ff 100%)';
  const cardBg = highContrast ? '#222' : '#fff';
  const textColor = highContrast ? '#fff' : '#333';
  const accentColor = highContrast ? '#ff0' : '#1976d2';

  const roleMsg = role === 'driver' ? 'Your driver account is pending approval.' :
                  role === 'admin' ? 'Your admin account is pending approval.' :
                  'Your account is pending approval.';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: mainBg }}>
      <div style={{ background: cardBg, padding: 32, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: 420, textAlign: 'center', color: textColor }}>
        <img src={LOGO_SRC} alt="App Logo" style={{ width: 64, height: 64, marginBottom: 12 }} />
        <h2 style={{ color: accentColor, marginBottom: 16 }}>⏳ Awaiting Admin Approval</h2>
        <button aria-label="Toggle high contrast mode" onClick={() => setHighContrast(h => !h)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: accentColor, fontWeight: 'bold', cursor: 'pointer', fontSize: 18 }}>
          {highContrast ? '🌙' : '☀️'}
        </button>
        <div ref={greetingRef} tabIndex={-1} style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, outline: 'none' }} aria-live="polite">
          Hi{name ? `, ${name}` : ''}!<br/>{roleMsg}
        </div>
        <div style={{ marginBottom: 16, fontSize: 15 }}>
          <span style={{ color: accentColor }}>Estimated wait time: ~{ESTIMATED_WAIT} minutes</span><br/>
          <span style={{ color: '#888', fontSize: 13 }}>You have waited {Math.floor(waited/60)}m {waited%60}s</span>
        </div>
        {!approved ? (
          <>
            <div style={{ margin: '16px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span className="sr-only">Loading</span>
                <div style={{ width: 32, height: 32, border: `4px solid ${accentColor}`, borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{'@keyframes spin { 100% { transform: rotate(360deg); } }'}</style>
                <div style={{ width: 120, height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden', marginLeft: 8 }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: accentColor, transition: 'width 0.5s' }} />
                </div>
              </div>
            </div>
            <p style={{ fontSize: 16, color: textColor, marginBottom: 18 }}>
              Your account request has been sent to the main admin.<br/>
              Please wait until your account is approved.<br/>
              You will be able to log in once approved.
            </p>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>
              If you believe this is a mistake, <a href={`mailto:support@university.edu?subject=Account Approval Issue for ${email}`} style={{ color: accentColor }}>contact support</a>.
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
              <button onClick={() => window.location.reload()} style={{ padding: '8px 18px', background: accentColor, color: highContrast ? '#000' : '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>
                Refresh Status
              </button>
              <button onClick={() => navigate('/login')} style={{ padding: '8px 18px', background: '#888', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>
                Go to Login
              </button>
            </div>
          </>
        ) : (
          <div style={{ color: '#28a745', fontSize: 20, fontWeight: 'bold', margin: '32px 0' }}>
            🎉 You have been approved! Redirecting to your dashboard...
          </div>
        )}
      </div>
    </div>
  );
} 