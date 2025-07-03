import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function UserNotifications({ setIsAuthenticated }) {
  const [notifications, setNotifications] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState('');
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all buses for dropdown
      const busesResponse = await axios.get(`${API_BASE_URL}/buses/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBuses(busesResponse.data);

      // Fetch all notifications (for demo purposes)
      const notificationsResponse = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notificationsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchBusNotifications = async (busNumber) => {
    if (!busNumber) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/notifications/bus/${busNumber}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleBusChange = (e) => {
    const busNumber = e.target.value;
    setSelectedBus(busNumber);
    if (busNumber) {
      fetchBusNotifications(busNumber);
    } else {
      fetchData(); // Show all notifications
    }
  };

  // Get user email from localStorage
  const userEmail = localStorage.getItem('userEmail');
  // Separate contact-reply notifications for this user
  const contactReplyNotifications = notifications.filter(n => n.type === 'contact-reply' && n.userEmail === userEmail);
  // Exclude contact-reply notifications from the main list
  const generalNotifications = notifications.filter(n => n.type !== 'contact-reply');

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(120deg, #f8fafc 0%, #e3f0ff 100%)',
      marginTop: 80,
    }}>
      <div style={{
        width: '100%',
        maxWidth: '95%',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: 40,
        margin: '20px auto',
        flex: 1
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>🔔 Notifications</h1>
        </div>

        {/* Bus Filter */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Filter by Bus</h3>
          <select
            value={selectedBus}
            onChange={handleBusChange}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          >
            <option value="">All Buses</option>
            {buses.map((bus) => (
              <option key={bus._id} value={bus.busNumber}>
                Bus {bus.busNumber} - {bus.routeNumber} ({bus.source} → {bus.destination})
              </option>
            ))}
          </select>
        </div>

        {/* Notifications List */}
        <div>
          <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>
            {selectedBus ? `Notifications for Bus ${selectedBus}` : 'All Notifications'} 
            ({generalNotifications.length})
          </h3>
          <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {generalNotifications.map((notification) => (
              <div key={notification._id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderLeft: '4px solid #3498db'
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
                      borderRadius: '5px'
                    }}>
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {generalNotifications.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔕</div>
              <h3>No notifications found</h3>
              <p>
                {selectedBus 
                  ? `No notifications available for Bus ${selectedBus}. Check back later for updates!`
                  : 'No notifications available at the moment. Check back later for updates!'
                }
              </p>
            </div>
          )}
        </div>

        {/* Contact Replies Section */}
        <div style={{ marginBottom: 32 }}>
          <h3>Contact Replies</h3>
          {contactReplyNotifications.length > 0 ? (
            <div style={{ display: 'grid', gap: '15px' }}>
              {contactReplyNotifications.map((notification) => (
                <div key={notification._id} style={{
                  border: '1px solid #388e3c',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#e8f5e9',
                  color: '#388e3c',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 6 }}>Reply to your contact submission:</div>
                  <div style={{ marginBottom: 8 }}>{notification.message}</div>
                  <div style={{ fontSize: 12, color: '#388e3c' }}>Received: {new Date(notification.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#888', fontSize: 16, marginTop: 12 }}>
              No contact replies yet.
            </div>
          )}
        </div>

        {/* Notification Tips */}
        <div style={{ 
          marginTop: '40px', 
          padding: '20px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '8px',
          borderLeft: '4px solid #2196f3'
        }}>
          <h4 style={{ color: '#1976d2', marginBottom: '15px' }}>💡 Notification Tips</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Select a specific bus to see notifications for that route only</li>
            <li>Notifications are updated in real-time by the bus management team</li>
            <li>Important updates about delays, route changes, and service announcements will appear here</li>
            <li>Check this page regularly for the latest information about your bus routes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserNotifications; 