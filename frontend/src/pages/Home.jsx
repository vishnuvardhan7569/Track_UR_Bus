import './Home.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { searchBusesByStop } from '../utils/api';

const LOGO_SRC = '/travel.png';

function Home({ setIsAuthenticated }) {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [stop, setStop] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  const name = localStorage.getItem('userName') || '';

  const mainBg = '#f8fafc';
  const cardBg = '#fff';
  const textColor = '#222';
  const accentColor = '#1976d2';

  const handleSearch = async (type) => {
    setLoading(true);
    try {
      let res;
      if (type === 'vehicle') {
        res = await axios.get(`http://localhost:5000/api/buses/search/vehicle?busNumber=${vehicleNumber}`);
      } else if (type === 'route') {
        res = await axios.get(`http://localhost:5000/api/buses/search/route?routeNumber=${routeNumber}`);
      } else if (type === 'source-destination') {
        res = await axios.get(`http://localhost:5000/api/buses/search/source-destination?source=${source}&destination=${destination}`);
      } else if (type === 'stop') {
        const data = await searchBusesByStop(stop);
        res = { data };
      }
      navigate('/results', { state: { results: res.data } });
    } catch (err) {
      setToast('❌ No matching buses found');
      setTimeout(() => setToast(''), 2500);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (setIsAuthenticated) setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  const handleNotifications = () => {
    navigate('/notifications');
  };

  const handleContact = () => {
    navigate('/contact');
  };

  const handleHelp = () => {
    navigate('/help');
  };

  return (
    <div className="home-bg" style={{ background: mainBg, minHeight: '100vh', color: textColor }}>
      <div className="home-container" style={{ width: '95vw', maxWidth: '95vw', padding: 24 }}>
        {/* Header */}
        <div className="home-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={LOGO_SRC} alt="Logo" style={{ width: 48, height: 48 }} />
            <h1 className="home-title" style={{fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', color: accentColor, margin: 0}}>Track UR Bus</h1>
          </div>
        </div>
        {/* Greeting and Quick Links */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 20, fontWeight: 'bold' }}>Hi{name ? `, ${name}` : ''}! Ready to track your bus?</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleBackToDashboard} style={{ padding: '6px 14px', background: accentColor, color: '#fff', border: 'none', borderRadius: 5, fontWeight: 'bold', cursor: 'pointer' }}>Dashboard</button>
            <button onClick={handleContact} style={{ padding: '6px 14px', background: accentColor, color: '#fff', border: 'none', borderRadius: 5, fontWeight: 'bold', cursor: 'pointer' }}>Contact</button>
            <button onClick={handleHelp} style={{ padding: '6px 14px', background: accentColor, color: '#fff', border: 'none', borderRadius: 5, fontWeight: 'bold', cursor: 'pointer' }}>Help</button>
          </div>
        </div>
        {/* Search Instructions */}
        <div className="home-instructions" style={{ background: cardBg, borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <h3 style={{ color: accentColor }}>🔍 Search for University Buses</h3>
          <p>Use any of the search options below to find and track university buses in real-time.</p>
        </div>
        {/* Vehicle Search */}
        <div className="search-box" style={{ background: cardBg, borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <h3>🚌 Search by Vehicle Number</h3>
          <input
            className="input-field"
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="Enter vehicle number (e.g., UR001)"
            style={{ marginBottom: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc', width: '100vh' }}
          />
          <button 
            className="search-btn" 
            onClick={() => handleSearch('vehicle')}
            disabled={loading || !vehicleNumber.trim()}
            style={{ padding: '8px 18px', background: accentColor, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', minWidth: 100 }}
          >
            {loading ? <span><span className="sr-only">Searching</span><span style={{ display: 'inline-block', width: 18, height: 18, border: `3px solid ${accentColor}`, borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: 6 }} />Searching...</span> : 'Search'}
          </button>
        </div>
        {/* Route Search */}
        <div className="search-box" style={{ background: cardBg, borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <h3>🛣️ Search by Route Number</h3>
          <input
            className="input-field"
            type="text"
            value={routeNumber}
            onChange={(e) => setRouteNumber(e.target.value)}
            placeholder="Enter route number (e.g., R001)"
            style={{ marginBottom: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc', width: '100vh' }}
          />
          <button 
            className="search-btn" 
            onClick={() => handleSearch('route')}
            disabled={loading || !routeNumber.trim()}
            style={{ padding: '8px 18px', background: accentColor, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', minWidth: 100 }}
          >
            {loading ? <span><span className="sr-only">Searching</span><span style={{ display: 'inline-block', width: 18, height: 18, border: `3px solid ${accentColor}`, borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: 6 }} />Searching...</span> : 'Search'}
          </button>
        </div>
        {/* Source & Destination Search */}
        <div className="search-box" style={{ background: cardBg, borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <h3>📍 Search by Source & Destination</h3>
          <div className="input-group" style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              className="input-field"
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Source (e.g., University Campus)"
              style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: '60vh' }}
            />
            <input
              className="input-field"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination (e.g., City Center)"
              style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', width: '60vh' }}
            />
          </div>
          <button 
            className="search-btn" 
            onClick={() => handleSearch('source-destination')}
            disabled={loading || !source.trim() || !destination.trim()}
            style={{ padding: '8px 18px', background: accentColor, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', minWidth: 100 }}
          >
            {loading ? <span><span className="sr-only">Searching</span><span style={{ display: 'inline-block', width: 18, height: 18, border: `3px solid ${accentColor}`, borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: 6 }} />Searching...</span> : 'Search'}
          </button>
        </div>
        {/* Stop Search */}
        <div className="search-box" style={{ background: cardBg, borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <h3>🚏 Search by Stop (Any Intermediate Stop)</h3>
          <input
            className="input-field"
            type="text"
            value={stop}
            onChange={(e) => setStop(e.target.value)}
            placeholder="Enter stop name (e.g., Shopping Mall)"
            style={{ marginBottom: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc', width: '100vh' }}
          />
          <button 
            className="search-btn" 
            onClick={() => handleSearch('stop')}
            disabled={loading || !stop.trim()}
            style={{ padding: '8px 18px', background: accentColor, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', minWidth: 100 }}
          >
            {loading ? <span><span className="sr-only">Searching</span><span style={{ display: 'inline-block', width: 18, height: 18, border: `3px solid ${accentColor}`, borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: 6 }} />Searching...</span> : 'Search'}
          </button>
        </div>
        {/* Quick Tips */}
        <div className="home-tips" style={{ background: cardBg, borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <h4 style={{ color: accentColor }}>💡 Quick Tips</h4>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Try searching for "UR001" to see sample bus data</li>
            <li>Use "R001" to find buses on a specific route</li>
            <li>Search "University Campus" to "City Center" for source-destination</li>
            <li>Click on any bus in results to see its real-time location on the map</li>
          </ul>
        </div>
        {toast && (
          <div style={{ position: 'fixed', bottom: 30, left: 0, right: 0, margin: '0 auto', maxWidth: 320, background: '#dc3545', color: '#fff', padding: 12, borderRadius: 8, textAlign: 'center', fontWeight: 'bold', zIndex: 9999 }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
