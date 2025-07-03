import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { fetchAllBusesForDropdown } from '../utils/api';
import BusMap from '../components/BusMap';

function DriverDashboard() {
  const [tracking, setTracking] = useState(false);
  const [busNumber, setBusNumber] = useState('');
  const [status, setStatus] = useState('');
  const [buses, setBuses] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [driverDetails, setDriverDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });
  const [editStatus, setEditStatus] = useState('');
  const watchId = useRef(null);
  const pollInterval = useRef(null);

  // Simulate getting driver info from localStorage or auth
  const driverId = localStorage.getItem('userId') || 'driver-demo';

  useEffect(() => {
    // Fetch all buses for dropdown
    fetchAllBusesForDropdown().then(setBuses);
    // Fetch driver details
    const fetchDriver = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/protected/dashboard-data', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setDriverDetails(res.data);
        setEditForm({ name: res.data.name, email: res.data.email, password: '' });
      } catch (err) {
        setEditStatus('Error fetching driver details');
      }
    };
    fetchDriver();
  }, []);

  useEffect(() => {
    // Poll bus location while tracking
    if (tracking && busNumber) {
      const poll = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/buses/search/vehicle?busNumber=${busNumber}`);
          if (res.data && res.data[0] && res.data[0].currentLocation) {
            setCurrentLocation(res.data[0].currentLocation);
          }
        } catch {}
      };
      poll();
      pollInterval.current = setInterval(poll, 10000);
      return () => clearInterval(pollInterval.current);
    }
  }, [tracking, busNumber]);

  const startTracking = () => {
    if (!busNumber) {
      alert('Please select your bus!');
      return;
    }
    if (!navigator.geolocation) {
      alert('Geolocation is not supported!');
      return;
    }
    setTracking(true);
    setStatus('Tracking started. Sending live location updates...');
    watchId.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          await axios.put('http://localhost:5000/api/buses/update-location', {
            busNumber,
            lat: latitude,
            lng: longitude,
            driverId // for audit logging
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setStatus(`Location sent: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        } catch (err) {
          if (err.response?.status === 409) {
            setStatus('Another driver is already tracking this bus. You cannot start tracking.');
            setTracking(false);
            if (watchId.current) {
              navigator.geolocation.clearWatch(watchId.current);
            }
            return;
          }
          setStatus('Error sending location: ' + (err.response?.data?.msg || err.message));
        }
      },
      (err) => setStatus('Error getting location: ' + err.message),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  const stopTracking = () => {
    setTracking(false);
    setStatus('Tracking stopped.');
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
    }
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
    }
  };

  const handleEditChange = e => {
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    setEditStatus('');
    try {
      const payload = { name: editForm.name, email: editForm.email };
      if (editForm.password) payload.password = editForm.password;
      const res = await axios.put(`http://localhost:5000/api/protected/update-user/${driverId}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDriverDetails(res.data.user);
      setEditMode(false);
      setEditForm(f => ({ ...f, password: '' }));
      setEditStatus('Profile updated!');
      if (res.data.user?.name) localStorage.setItem('userName', res.data.user.name);
    } catch (err) {
      setEditStatus('Error updating profile: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ maxWidth: '40vw', margin: '60px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Driver Dashboard</h2>
      {/* Driver Details Section */}
      <div style={{ marginBottom: 32, padding: 16, background: '#f8fafc', borderRadius: 8 }}>
        {driverDetails && !editMode && (
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: 8 }}>🧑‍✈️ Hello {driverDetails.name ? ` ${driverDetails.name}` : 'Driver'}!</h3>
            <div style={{ color: '#1976d2', fontSize: 16, marginBottom: 8 }}>
              <span style={{ background: '#e3f0ff', padding: '6px 16px', borderRadius: 20, display: 'inline-block' }}>{driverDetails.email}</span>
            </div>
            <button onClick={() => setEditMode(true)} style={{ padding: '6px 16px', borderRadius: 5, background: '#1976d2', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Edit</button>
          </div>
        )}
        {editMode && (
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
            <input name="name" value={editForm.name} onChange={handleEditChange} placeholder="Name" required style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
            <input name="email" value={editForm.email} onChange={handleEditChange} placeholder="Email" type="email" required style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
            <input name="password" value={editForm.password} onChange={handleEditChange} placeholder="New Password (leave blank to keep)" type="password" style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ padding: '6px 16px', borderRadius: 5, background: '#1976d2', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Save</button>
              <button type="button" onClick={() => { setEditMode(false); setEditForm({ name: driverDetails.name, email: driverDetails.email, password: '' }); }} style={{ padding: '6px 16px', borderRadius: 5, background: '#888', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
            </div>
            {editStatus && <div style={{ color: editStatus.startsWith('Error') ? 'red' : 'green' }}>{editStatus}</div>}
          </form>
        )}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 'bold' }}>Bus Number:</label>
        <select
          value={busNumber}
          onChange={e => setBusNumber(e.target.value)}
          style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginTop: 6 }}
          disabled={tracking}
        >
          <option value="">Select your bus</option>
          {buses.map(bus => (
            <option key={bus.busNumber} value={bus.busNumber}>
              {bus.busNumber} ({bus.routeNumber})
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={tracking ? stopTracking : startTracking}
        style={{ width: '100%', padding: 14, background: tracking ? '#dc3545' : '#1976d2', color: 'white', border: 'none', borderRadius: 6, fontSize: 16, fontWeight: 'bold', cursor: 'pointer', marginBottom: 16 }}
      >
        {tracking ? 'Stop Tracking' : 'Start Tracking'}
      </button>
      <div style={{ minHeight: 32, color: tracking ? '#1976d2' : '#333', fontWeight: 'bold', textAlign: 'center' }}>{status}</div>
      {tracking && currentLocation &&
        typeof currentLocation.lat === 'number' &&
        typeof currentLocation.lng === 'number' &&
        !isNaN(currentLocation.lat) &&
        !isNaN(currentLocation.lng) && (
          <div style={{ marginTop: 24 }}>
            <h4 style={{ textAlign: 'center', fontSize: 15, marginBottom: 8 }}>Current Bus Location</h4>
            <BusMap location={currentLocation} zoom={16} />
          </div>
        )}
      <div style={{ marginTop: 24, fontSize: 13, color: '#888', textAlign: 'center' }}>
        <p>Keep this page open and allow location access while driving.</p>
      </div>
    </div>
  );
}

export default DriverDashboard; 