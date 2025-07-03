import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Notifications({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    busNumber: '',
    message: ''
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch notifications
      const notificationsResponse = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notificationsResponse.data);

      // Fetch buses for dropdown
      const busesResponse = await axios.get(`${API_BASE_URL}/buses/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBuses(busesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Admin privileges required.');
      } else if (error.response?.status === 401) {
        alert('Authentication failed. Please login again.');
      } else {
        alert('Error fetching data: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/notifications`, newNotification, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Notification created successfully!');
      setNewNotification({ busNumber: '', message: '' });
      setShowCreateForm(false);
      fetchData();
    } catch (error) {
      alert('Error creating notification: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteNotification = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/notifications/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Notification deleted successfully!');
        fetchData();
      } catch (error) {
        alert('Error deleting notification: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // Remove contact-reply filtering and section for admin notifications
  // Only show all notifications as generalNotifications
  const generalNotifications = notifications;

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
        width: '100%',
        maxWidth: '95%',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: 40,
        margin: 16
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>🔔 Notifications</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => navigate('/admin/dashboard')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Create Notification Button */}
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {showCreateForm ? '❌ Cancel' : '➕ Create New Notification'}
          </button>
        </div>

        {/* Create Notification Form */}
        {showCreateForm && (
          <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: '#f8f9fa'
          }}>
            <h3>Create New Notification</h3>
            <form onSubmit={handleCreateNotification}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Bus Number *
                </label>
                <select
                  value={newNotification.busNumber}
                  onChange={(e) => setNewNotification({...newNotification, busNumber: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">
                    {loading ? 'Loading buses...' : buses.length === 0 ? 'No buses available' : 'Select a bus'}
                  </option>
                  {buses.map((bus) => (
                    <option key={bus._id} value={bus.busNumber}>
                      Bus {bus.busNumber} - {bus.routeNumber} ({bus.source} → {bus.destination})
                    </option>
                  ))}
                </select>
                {buses.length === 0 && !loading && (
                  <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                    ⚠️ No buses found. Please add some buses first in the "Add Bus" section.
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Message *
                </label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  required
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                  placeholder="Enter notification message..."
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Create Notification
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewNotification({ busNumber: '', message: '' });
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notifications List */}
        <div>
          <h3>Recent Notifications ({generalNotifications.length})</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            {generalNotifications.map((notification) => (
              <div key={notification._id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ margin: 0, marginRight: '10px' }}>🚌 Bus {notification.busNumber}</h4>
                      <span style={{
                        fontSize: '12px',
                        color: '#6c757d',
                        backgroundColor: '#f8f9fa',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}>
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '16px', 
                      lineHeight: '1.5',
                      backgroundColor: '#f8f9fa',
                      padding: '15px',
                      borderRadius: '5px',
                      borderLeft: '4px solid #17a2b8'
                    }}>
                      {notification.message}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDeleteNotification(notification._id)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginLeft: '10px'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {generalNotifications.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
              <h3>No notifications yet</h3>
              <p>Create your first notification to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications; 