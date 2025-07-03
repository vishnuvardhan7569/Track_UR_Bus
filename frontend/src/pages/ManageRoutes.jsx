import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ManageRoutes({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBus, setEditingBus] = useState(null);
  const [editForm, setEditForm] = useState({
    routeNumber: '',
    source: '',
    destination: '',
    stops: '',
    arrivalTime: ''
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchBuses = async () => {
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
  };

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setEditForm({
      routeNumber: bus.routeNumber,
      source: bus.source,
      destination: bus.destination,
      stops: bus.stops ? bus.stops.join(', ') : '',
      arrivalTime: bus.arrivalTime || ''
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const stopsArray = editForm.stops.split(',').map(stop => stop.trim()).filter(stop => stop);
      
      const updateData = {
        ...editForm,
        stops: stopsArray
      };

      await axios.put(`${API_BASE_URL}/buses/update/${editingBus.busNumber}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Route updated successfully!');
      setEditingBus(null);
      fetchBuses();
    } catch (error) {
      alert('Error updating route: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (busNumber) => {
    if (window.confirm('Are you sure you want to delete this bus route?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/buses/delete/${busNumber}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Bus route deleted successfully!');
        fetchBuses();
      } catch (error) {
        alert('Error deleting bus route: ' + (error.response?.data?.message || error.message));
      }
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
        width: '100%',
        maxWidth: '95%',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: 40,
        margin: 16
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>🛣️ Manage Routes</h1>
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

        <div style={{ marginBottom: '20px' }}>
          <h3>Total Routes: {buses.length}</h3>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {buses.map((bus) => (
            <div key={bus._id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: editingBus?._id === bus._id ? '#f8f9fa' : 'white'
            }}>
              {editingBus?._id === bus._id ? (
                // Edit Form
                <div>
                  <h4>Editing Bus {bus.busNumber}</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Route Number *
                      </label>
                      <input
                        type="text"
                        value={editForm.routeNumber}
                        onChange={(e) => setEditForm({...editForm, routeNumber: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '5px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Arrival Time
                      </label>
                      <input
                        type="time"
                        value={editForm.arrivalTime}
                        onChange={(e) => setEditForm({...editForm, arrivalTime: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '5px'
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Source *
                      </label>
                      <input
                        type="text"
                        value={editForm.source}
                        onChange={(e) => setEditForm({...editForm, source: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '5px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Destination *
                      </label>
                      <input
                        type="text"
                        value={editForm.destination}
                        onChange={(e) => setEditForm({...editForm, destination: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '5px'
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Stops (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editForm.stops}
                      onChange={(e) => setEditForm({...editForm, stops: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                      }}
                      placeholder="Stop 1, Stop 2, Stop 3"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={handleUpdate}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Save Changes
                    </button>
                    <button 
                      onClick={() => setEditingBus(null)}
                      style={{
                        padding: '8px 16px',
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
                </div>
              ) : (
                // Display Mode
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4>🚌 Bus {bus.busNumber}</h4>
                      <p><strong>Route:</strong> {bus.routeNumber}</p>
                      <p><strong>Route:</strong> {bus.source} → {bus.destination}</p>
                      <p><strong>Stops:</strong> {bus.stops ? bus.stops.join(', ') : 'No stops defined'}</p>
                      <p><strong>Arrival Time:</strong> {bus.arrivalTime || 'Not set'}</p>
                      <p><strong>Status:</strong> 
                        <span style={{ 
                          color: bus.status === 'on_time' ? '#28a745' : '#dc3545',
                          fontWeight: 'bold',
                          marginLeft: '5px'
                        }}>
                          {bus.status === 'on_time' ? '🟢 On Time' : '🔴 Delayed'}
                        </span>
                      </p>
                      <p><strong>Last Updated:</strong> {new Date(bus.lastUpdated).toLocaleString()}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => handleEdit(bus)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#17a2b8',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(bus.busNumber)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {buses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            <h3>No routes found</h3>
            <p>Add some bus routes to get started!</p>
            <button 
              onClick={() => navigate('/admin/add-bus')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ➕ Add New Bus
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageRoutes; 