import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LOGO_SRC = '/travel.png';

function Dashboard({ setIsAuthenticated }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/protected/dashboard-data', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setData(res.data);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchProtectedData();
  }, [navigate]);

  useEffect(() => {
    if (!loading && data) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [loading, data]);

  const handleTrackBus = () => {
    navigate('/search');
  };

  const handleAdminAccess = () => {
    if (data?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      alert('Access denied. Admin privileges required.');
    }
  };

  const handleNotifications = () => {
    navigate('/notifications');
  };

  const handleContact = () => {
    navigate('/contact');
  };

  // Personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const mainBg = '#f8fafc';
  const cardBg = '#fff';
  const textColor = '#222';
  const accentColor = '#1976d2';

  if (loading) {
    return (
      <div className="dashboard-bg" style={{ background: mainBg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="dashboard-container">
          <div className="dashboard-loading" style={{ textAlign: 'center' }}>
            <img src={LOGO_SRC} alt="Logo" style={{ width: 60, marginBottom: 16 }} />
            <div style={{ marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, border: `4px solid ${accentColor}`, borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
              <style>{'@keyframes spin { 100% { transform: rotate(360deg); } }'}</style>
            </div>
            <span style={{ color: textColor }}>Loading your dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-bg" style={{ background: mainBg, minHeight: '100vh', color: textColor }}>
      <div className="dashboard-container" style={{ maxWidth: '95%', margin: '0 auto', padding: 24, marginTop: 100 , marginBottom: 20}}>
        {/* Header */}
        <div className="dashboard-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={LOGO_SRC} alt="Logo" style={{ width: 48, height: 48 }} />
            <h1 style={{ color: accentColor, margin: 0 }}>University Bus Tracker</h1>
          </div>
        </div>
        {/* Welcome Section */}
        {data ? (
          <div className="dashboard-welcome" style={{ marginBottom: 24 }}>
            <div className="dashboard-welcome-card" style={{ background: cardBg, borderRadius: 10, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ margin: 0 }}>{getGreeting()}, {data.name}! 👋</h2>
              <p style={{ margin: '8px 0 0 0' }}><strong>Role:</strong> {data.role === 'admin' ? 'Administrator' : 'Student'}</p>
              <p style={{ margin: 0 }}><strong>Email:</strong> {data.email}</p>
            </div>
          </div>
        ) : (
          <div className="dashboard-welcome">
            <p>Loading user data...</p>
          </div>
        )}
        {/* Main Actions */}
        <div className="dashboard-main-actions" style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
          <div className="dashboard-btn dashboard-action-btn" onClick={handleTrackBus} style={{ background: cardBg, color: textColor, borderRadius: 8, padding: 20, flex: 1, minWidth: 220, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div className="dashboard-btn-icon" style={{ fontSize: 32 }}>🚌</div>
            <h3 style={{ margin: '10px 0 4px 0' }}>Track UR Bus</h3>
            <p style={{ margin: 0 }}>Search and track university buses in real-time</p>
          </div>
          <div className="dashboard-btn dashboard-action-btn" onClick={handleNotifications} style={{ background: cardBg, color: textColor, borderRadius: 8, padding: 20, flex: 1, minWidth: 220, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div className="dashboard-btn-icon" style={{ fontSize: 32 }}>🔔</div>
            <h3 style={{ margin: '10px 0 4px 0' }}>Notifications</h3>
            <p style={{ margin: 0 }}>View your bus and system notifications</p>
          </div>
          <div className="dashboard-btn dashboard-action-btn" onClick={handleContact} style={{ background: cardBg, color: textColor, borderRadius: 8, padding: 20, flex: 1, minWidth: 220, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div className="dashboard-btn-icon" style={{ fontSize: 32 }}>📞</div>
            <h3 style={{ margin: '10px 0 4px 0' }}>Contact</h3>
            <p style={{ margin: 0 }}>Contact admin or support for help</p>
          </div>
          {data?.role === 'admin' && (
            <div className="dashboard-btn dashboard-action-btn" onClick={handleAdminAccess} style={{ background: cardBg, color: textColor, borderRadius: 8, padding: 20, flex: 1, minWidth: 220, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div className="dashboard-btn-icon" style={{ fontSize: 32 }}>🛠️</div>
              <h3 style={{ margin: '10px 0 4px 0' }}>Admin Panel</h3>
              <p style={{ margin: 0 }}>Manage buses, routes, and system settings</p>
            </div>
          )}
        </div>
        {/* Quick Info */}
        <div className="dashboard-info" style={{ background: cardBg, borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h4 style={{ color: accentColor, marginBottom: 20 }}>📋 Quick Information</h4>
          <div className="dashboard-info-grid" style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 20, minWidth: 220, flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 16 }}>
              <p className="dashboard-info-title" style={{ fontWeight: 'bold', marginBottom: 10 }}>Search Options:</p>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>By Vehicle Number</li>
                <li>By Route Number</li>
                <li>By Source & Destination</li>
                <li>By Stop Name</li>
              </ul>
            </div>
            <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 20, minWidth: 220, flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 16 }}>
              <p className="dashboard-info-title" style={{ fontWeight: 'bold', marginBottom: 10 }}>Features:</p>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>Real-time Location Tracking</li>
                <li>Bus Status Updates</li>
                <li>Interactive Maps</li>
                <li>Arrival Time Information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
