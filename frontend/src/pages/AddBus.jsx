import './AddBus.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddBus({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    busNumber: '',
    routeNumber: '',
    source: '',
    destination: '',
    stops: '',
    arrivalTime: '',
    lat: '16.4649',
    lng: '80.5083'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const stopsArray = formData.stops.split(',').map(stop => stop.trim()).filter(stop => stop);

      const busData = {
        ...formData,
        stops: stopsArray,
        currentLocation: {
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng)
        }
      };

      await axios.post(`${API_BASE_URL}/buses/add-bus`, busData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Bus added successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding bus');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addbus-bg">
      <div className="addbus-container">
        <div className="addbus-header">
          <h2>➕ Add New Bus</h2>
        </div>
        <form className="addbus-form" onSubmit={handleSubmit}>
          <div className="addbus-form-group">
            <label>Bus Number *</label>
            <input
              type="text"
              name="busNumber"
              value={formData.busNumber}
              onChange={handleChange}
              required
              placeholder="e.g., UR001"
            />
          </div>
          <div className="addbus-form-group">
            <label>Route Number *</label>
            <input
              type="text"
              name="routeNumber"
              value={formData.routeNumber}
              onChange={handleChange}
              required
              placeholder="e.g., R001"
            />
          </div>
          <div className="addbus-form-row">
            <div className="addbus-form-group">
              <label>Source *</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
                placeholder="e.g., University"
              />
            </div>
            <div className="addbus-form-group">
              <label>Destination *</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                placeholder="e.g., City Center"
              />
            </div>
          </div>
          <div className="addbus-form-group">
            <label>Stops (comma-separated)</label>
            <input
              type="text"
              name="stops"
              value={formData.stops}
              onChange={handleChange}
              placeholder="e.g., Stop 1, Stop 2, Stop 3"
            />
          </div>
          <div className="addbus-form-group">
            <label>Expected Arrival Time</label>
            <input
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
            />
          </div>
          <div className="addbus-form-row">
            <div className="addbus-form-group">
              <label>Latitude *</label>
              <input
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                step="0.0001"
                required
                placeholder="16.4649"
              />
            </div>
            <div className="addbus-form-group">
              <label>Longitude *</label>
              <input
                type="number"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                step="0.0001"
                required
                placeholder="80.5083"
              />
            </div>
          </div>
          {error && (
            <div className="addbus-error">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="addbus-btn"
            disabled={loading}
          >
            {loading ? 'Adding Bus...' : 'Add Bus'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBus; 