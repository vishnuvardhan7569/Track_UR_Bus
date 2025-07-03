import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import BusMap from '../components/BusMap';
import AdminFeedback from './AdminFeedback';

function AdminDashboard({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState(null);
  const [editingLocation, setEditingLocation] = useState(false);
  const [locationForm, setLocationForm] = useState({
    lat: '',
    lng: ''
  });
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [editUserForm, setEditUserForm] = useState({ name: '', email: '', role: '', status: '' });
  const [pendingNotes, setPendingNotes] = useState({});
  const [selectedPending, setSelectedPending] = useState([]);

  const isMobile = window.innerWidth <= 600;

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchAllUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/protected/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllUsers(res.data);
    } catch (err) {
      setUsersError('Error fetching users');
    } finally {
      setUsersLoading(false);
    }
  }, [API_BASE_URL]);

  const fetchBuses = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/buses/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBuses(response.data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const fetchPendingUsers = useCallback(async () => {
    setPendingLoading(true);
    setPendingError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/protected/pending-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingUsers(res.data);
    } catch (err) {
      setPendingError('Error fetching pending users');
    } finally {
      setPendingLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchAllUsers();
    fetchBuses();
    fetchPendingUsers();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchBuses();
      fetchPendingUsers();
      fetchAllUsers();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchAllUsers, fetchBuses, fetchPendingUsers]);

  // Update location form when selected bus changes
  useEffect(() => {
    if (selectedBus && selectedBus.currentLocation) {
      setLocationForm({
        lat: selectedBus.currentLocation.lat?.toString() || '',
        lng: selectedBus.currentLocation.lng?.toString() || ''
      });
    }
  }, [selectedBus]);

  const updateBusLocation = async (busNumber, lat, lng) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/buses/update-location`, {
        busNumber,
        lat,
        lng
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update the selectedBus state with new location data
      if (selectedBus && selectedBus.busNumber === busNumber) {
        const updatedBus = {
          ...selectedBus,
          currentLocation: { lat, lng },
          lastUpdated: new Date()
        };
        setSelectedBus(updatedBus);
        
        // Update the location form with new coordinates
        setLocationForm({
          lat: lat.toString(),
          lng: lng.toString()
        });
      }
      
      fetchBuses(); // Refresh data
      alert('Location updated successfully!');
    } catch (error) {
      alert('Error updating location');
    }
  };

  const toggleBusStatus = async (busNumber, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'on_time' ? 'delayed' : 'on_time';
      
      await axios.put(`${API_BASE_URL}/buses/update/${busNumber}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update the selectedBus state with new status
      if (selectedBus && selectedBus.busNumber === busNumber) {
        const updatedBus = {
          ...selectedBus,
          status: newStatus,
          lastUpdated: new Date()
        };
        setSelectedBus(updatedBus);
      }
      
      fetchBuses(); // Refresh data
      alert(`Status updated to: ${newStatus === 'on_time' ? 'On Time' : 'Delayed'}`);
    } catch (error) {
      alert('Error updating status: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleManualLocationUpdate = async () => {
    if (!locationForm.lat || !locationForm.lng) {
      alert('Please enter both latitude and longitude');
      return;
    }

    const lat = parseFloat(locationForm.lat);
    const lng = parseFloat(locationForm.lng);

    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid numbers for latitude and longitude');
      return;
    }

    try {
      await updateBusLocation(selectedBus.busNumber, lat, lng);
      setEditingLocation(false);
    } catch (error) {
      alert('Error updating location');
    }
  };

  const handlePendingNoteChange = (userId, value) => {
    setPendingNotes(notes => ({ ...notes, [userId]: value }));
  };

  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/protected/approve-user/${userId}`, { note: pendingNotes[userId] || '' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPendingUsers();
      setPendingNotes(notes => ({ ...notes, [userId]: '' }));
      setSelectedPending(sel => sel.filter(id => id !== userId));
    } catch (err) {
      alert('Error approving user');
    }
  };

  const handleReject = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/protected/reject-user/${userId}`, { note: pendingNotes[userId] || '' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPendingUsers();
      setPendingNotes(notes => ({ ...notes, [userId]: '' }));
      setSelectedPending(sel => sel.filter(id => id !== userId));
    } catch (err) {
      alert('Error rejecting user');
    }
  };

  const handleBulkApprove = async () => {
    for (const userId of selectedPending) {
      await handleApprove(userId);
    }
  };
  const handleBulkReject = async () => {
    for (const userId of selectedPending) {
      await handleReject(userId);
    }
  };
  const handlePendingSelect = (userId) => {
    setSelectedPending(sel => sel.includes(userId) ? sel.filter(id => id !== userId) : [...sel, userId]);
  };
  const handlePendingSelectAll = () => {
    if (selectedPending.length === pendingUsers.length) setSelectedPending([]);
    else setSelectedPending(pendingUsers.map(u => u._id));
  };

  const handleEditUser = (user) => {
    setEditUserId(user._id);
    setEditUserForm({ name: user.name, email: user.email, role: user.role, status: user.status });
  };

  const handleEditUserChange = (e) => {
    setEditUserForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEditUserSave = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/protected/update-user/${userId}`,
        { ...editUserForm },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditUserId(null);
      fetchAllUsers();
    } catch (err) {
      alert('Error updating user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/protected/delete-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllUsers();
    } catch (err) {
      alert('Error deleting user');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(120deg, #f8fafc 0%, #e3f0ff 100%)'
    }}>
      <div style={{
        width: isMobile ? '100%' : '100%',
        maxWidth: isMobile ? '100%' : '95%',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: isMobile ? 10 : 40,
        margin: 16
      }}>
        <div style={{ marginBottom: isMobile ? '15px' : '30px' }}>
          <h2 style={{ fontSize: isMobile ? '1.2rem' : '2rem' }}>🗺️ All Buses Live Map</h2>
          <div style={{ width: '100%' }}>
            <BusMap buses={buses} style={{ height: isMobile ? '250px' : '400px', width: '100%' }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>🛠️ Admin Dashboard</h1>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <button 
            onClick={() => navigate('/admin/add-bus')}
            style={{
              padding: '15px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ➕ Add New Bus
          </button>
          <button 
            onClick={() => navigate('/admin/manage-routes')}
            style={{
              padding: '15px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🛣️ Manage Routes
          </button>
          <button 
            onClick={() => navigate('/admin/notifications')}
            style={{
              padding: '15px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🔔 Notifications
          </button>
        </div>

        {/* Bus Management */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Bus List */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <h3>🚌 Active Buses ({buses.length})</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {buses.map((bus) => (
                <div 
                  key={bus._id}
                  onClick={() => setSelectedBus(bus)}
                  style={{
                    padding: '15px',
                    margin: '10px 0',
                    backgroundColor: selectedBus?._id === bus._id ? '#e3f2fd' : 'white',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <h4>Bus {bus.busNumber}</h4>
                  <p><strong>Route:</strong> {bus.routeNumber}</p>
                  <p><strong>Route:</strong> {bus.source} → {bus.destination}</p>
                  <p><strong>Status:</strong> 
                    <span style={{ 
                      color: bus.status === 'on_time' ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {bus.status === 'on_time' ? '🟢 On Time' : '🔴 Delayed'}
                    </span>
                  </p>
                  <p><strong>Last Updated:</strong> {new Date(bus.lastUpdated).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bus Details & Map */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <h3>📍 Bus Details</h3>
            {selectedBus ? (
              <div>
                <h4>Bus {selectedBus.busNumber}</h4>
                <p><strong>Route:</strong> {selectedBus.routeNumber}</p>
                <p><strong>Source:</strong> {selectedBus.source}</p>
                <p><strong>Destination:</strong> {selectedBus.destination}</p>
                <p><strong>Status:</strong> {selectedBus.status}</p>
                <p><strong>Arrival Time:</strong> {selectedBus.arrivalTime}</p>
                
                {/* Location Update */}
                <div style={{ marginTop: '20px' }}>
                  <h5>Update Location</h5>
                  
                  {editingLocation ? (
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                            Latitude
                          </label>
                          <input
                            type="number"
                            value={locationForm.lat}
                            onChange={(e) => setLocationForm({...locationForm, lat: e.target.value})}
                            step="0.0001"
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '14px'
                            }}
                            placeholder="e.g., 16.4649"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                            Longitude
                          </label>
                          <input
                            type="number"
                            value={locationForm.lng}
                            onChange={(e) => setLocationForm({...locationForm, lng: e.target.value})}
                            step="0.0001"
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '14px'
                            }}
                            placeholder="e.g., 80.5083"
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={handleManualLocationUpdate}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          Save Location
                        </button>
                        <button 
                          onClick={() => setEditingLocation(false)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginBottom: '15px' }}>
                      <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                        <strong>Current Location:</strong><br />
                        Lat: {selectedBus.currentLocation?.lat?.toFixed(4) || 'Not set'}<br />
                        Lng: {selectedBus.currentLocation?.lng?.toFixed(4) || 'Not set'}
                      </p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => setEditingLocation(true)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          Edit Location
                        </button>
                        <button 
                          onClick={() => {
                            // Simulate location update (in real app, this would come from GPS)
                            const lat = 16.4649 + (Math.random() - 0.5) * 0.01;
                            const lng = 80.5083 + (Math.random() - 0.5) * 0.01;
                            updateBusLocation(selectedBus.busNumber, lat, lng);
                          }}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          Random Location
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status Toggle */}
                  <div style={{ marginTop: '15px' }}>
                    <h5>Update Status</h5>
                    <button 
                      onClick={() => toggleBusStatus(selectedBus.busNumber, selectedBus.status)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: selectedBus.status === 'on_time' ? '#dc3545' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {selectedBus.status === 'on_time' ? '🔴 Mark as Delayed' : '🟢 Mark as On Time'}
                    </button>
                  </div>
                </div>

                {/* Map */}
                <div style={{ marginTop: '20px' }}>
                  <BusMap 
                    key={`${selectedBus.busNumber}-${selectedBus.currentLocation?.lat}-${selectedBus.currentLocation?.lng}`}
                    location={selectedBus.currentLocation} 
                    title={`Bus ${selectedBus.busNumber} - Route ${selectedBus.routeNumber}`}
                  />
                </div>
              </div>
            ) : (
              <p style={{ color: 'gray', fontStyle: 'italic' }}>Select a bus to view details</p>
            )}
          </div>
        </div>

        {/* Pending Users Section */}
        <div style={{ margin: '40px 0', padding: 24, background: '#f8fafc', borderRadius: 12 }}>
          <h2 style={{ marginBottom: 16, color: '#1976d2' }}>Pending Admin/Driver Requests</h2>
          <div style={{ marginBottom: 12, display: 'flex', gap: 12 }}>
            <button onClick={handleBulkApprove} disabled={selectedPending.length === 0} style={{ padding: '6px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: 5, fontWeight: 'bold', cursor: selectedPending.length === 0 ? 'not-allowed' : 'pointer' }}>Bulk Approve</button>
            <button onClick={handleBulkReject} disabled={selectedPending.length === 0} style={{ padding: '6px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: 5, fontWeight: 'bold', cursor: selectedPending.length === 0 ? 'not-allowed' : 'pointer' }}>Bulk Reject</button>
          </div>
          {pendingLoading ? (
            <div>Loading pending users...</div>
          ) : pendingError ? (
            <div style={{ color: 'red' }}>{pendingError}</div>
          ) : pendingUsers.length === 0 ? (
            <div style={{ color: '#888' }}>No pending requests.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead>
                <tr style={{ background: '#e3f0ff' }}>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}><input type="checkbox" checked={selectedPending.length === pendingUsers.length} onChange={handlePendingSelectAll} aria-label="Select all pending" /></th>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Name</th>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Email</th>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Requested Role</th>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Note</th>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map(user => (
                  <tr key={user._id}>
                    <td style={{ padding: 10, border: '1px solid #ddd', textAlign: 'center' }}>
                      <input type="checkbox" checked={selectedPending.includes(user._id)} onChange={() => handlePendingSelect(user._id)} aria-label={`Select ${user.name}`} />
                    </td>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>{user.name}</td>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>{user.email}</td>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>{user.requestedRole}</td>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>
                      <input type="text" value={pendingNotes[user._id] || ''} onChange={e => handlePendingNoteChange(user._id, e.target.value)} placeholder="Add note (optional)" style={{ width: '100%', padding: 4, borderRadius: 4, border: '1px solid #ccc' }} />
                    </td>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>
                      <button onClick={() => handleApprove(user._id)} style={{ marginRight: 8, padding: '6px 14px', background: '#28a745', color: 'white', border: 'none', borderRadius: 5, fontWeight: 'bold', cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => handleReject(user._id)} style={{ padding: '6px 14px', background: '#dc3545', color: 'white', border: 'none', borderRadius: 5, fontWeight: 'bold', cursor: 'pointer' }}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* All Users Section */}
        <div style={{ margin: '40px 0', padding: 24, background: '#f8fafc', borderRadius: 12 }}>
          <h2 style={{ marginBottom: 16, color: '#1976d2' }}>All Users</h2>
          {usersLoading ? (
            <div>Loading users...</div>
          ) : usersError ? (
            <div style={{ color: 'red' }}>{usersError}</div>
          ) : allUsers.length === 0 ? (
            <div style={{ color: '#888' }}>No users found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead>
                <tr style={{ background: '#e3f0ff' }}>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Name</th>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Email</th>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Role</th>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Status</th>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Approval Note</th>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map(user => (
                  <tr key={user._id}>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>
                      {editUserId === user._id ? (
                        <input name="name" value={editUserForm.name} onChange={handleEditUserChange} style={{ padding: 4, borderRadius: 4, border: '1px solid #ccc' }} />
                      ) : user.name}
                    </td>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>
                      {editUserId === user._id ? (
                        <input name="email" value={editUserForm.email} onChange={handleEditUserChange} style={{ padding: 4, borderRadius: 4, border: '1px solid #ccc' }} />
                      ) : user.email}
                    </td>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>
                      {editUserId === user._id ? (
                        <select name="role" value={editUserForm.role} onChange={handleEditUserChange} style={{ padding: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                          <option value="student">Student</option>
                          <option value="driver">Driver</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : user.role}
                    </td>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>
                      {editUserId === user._id ? (
                        <select name="status" value={editUserForm.status} onChange={handleEditUserChange} style={{ padding: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                          <option value="approved">Approved</option>
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      ) : user.status}
                    </td>
                    <td style={{ padding: 10, border: '1px solid #ddd', fontSize: 13, color: '#888' }}>
                      {user.approvalNote || '-'}
                    </td>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>
                      {editUserId === user._id ? (
                        <>
                          <button onClick={() => handleEditUserSave(user._id)} style={{ marginRight: 8, padding: '6px 14px', background: '#28a745', color: 'white', border: 'none', borderRadius: 5, fontWeight: 'bold', cursor: 'pointer' }}>Save</button>
                          <button onClick={() => setEditUserId(null)} style={{ padding: '6px 14px', background: '#888', color: 'white', border: 'none', borderRadius: 5, fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditUser(user)} style={{ marginRight: 8, padding: '6px 14px', background: '#1976d2', color: 'white', border: 'none', borderRadius: 5, fontWeight: 'bold', cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => handleDeleteUser(user._id)} style={{ padding: '6px 14px', background: '#dc3545', color: 'white', border: 'none', borderRadius: 5, fontWeight: 'bold', cursor: 'pointer' }}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Routes>
        <Route path="/admin/feedback" element={<AdminFeedback />} />
      </Routes>
    </div>
  );
}

export default AdminDashboard;
