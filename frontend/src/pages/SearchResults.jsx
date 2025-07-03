// src/pages/SearchResults.js
import { useLocation, useNavigate } from 'react-router-dom';
import BusMap from '../components/BusMap';
import { useEffect, useState } from 'react';
import axios from 'axios';

function SearchResults({ setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [results] = useState(location.state?.results || []);
  const [selectedBus, setSelectedBus] = useState(null);
  const [liveBus, setLiveBus] = useState(null);

  useEffect(() => {
    if (!results || results.length === 0) {
      navigate('/search');
    }
  }, [results, navigate]);

  useEffect(() => {
    if (!selectedBus) {
      setLiveBus(null);
      return;
    }
    let intervalId;
    const fetchLiveBus = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/buses/search/vehicle?busNumber=${selectedBus.busNumber}`);
        if (response.data && response.data.length > 0) {
          setLiveBus(response.data[0]);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchLiveBus();
    intervalId = setInterval(fetchLiveBus, 5000);
    return () => clearInterval(intervalId);
  }, [selectedBus]);

  const handleBackToSearch = () => {
    navigate('/search');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (setIsAuthenticated) setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  const getStatusColor = (status) => {
    return status === 'on_time' ? '#28a745' : '#dc3545';
  };

  const getStatusIcon = (status) => {
    return status === 'on_time' ? '🟢' : '🔴';
  };

  if (!results || results.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>No results found</h2>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          <button 
            onClick={handleBackToSearch}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ← Back to Search
          </button>
          <button 
            onClick={handleBackToDashboard}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(120deg, #f8fafc 0%, #e3f0ff 100%)',
      marginTop: 80
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
          <h1>🚌 Search Results ({results.length} buses found)</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleBackToSearch}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              ← New Search
            </button>
            <button 
              onClick={handleBackToDashboard}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Dashboard
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Bus List */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <h3>Available Buses</h3>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {results.map((bus) => (
                <div 
                  key={bus._id}
                  onClick={() => setSelectedBus(bus)}
                  style={{
                    padding: '20px',
                    margin: '15px 0',
                    backgroundColor: selectedBus?._id === bus._id ? '#e3f2fd' : 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, color: '#007bff' }}>Bus {bus.busNumber}</h3>
                    <span style={{ 
                      color: getStatusColor(bus.status),
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {getStatusIcon(bus.status)} {bus.status === 'on_time' ? 'On Time' : 'Delayed'}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '10px' }}>
                    <p style={{ margin: '5px 0', fontWeight: 'bold' }}>
                      Route: {bus.routeNumber}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      {bus.source} → {bus.destination}
                    </p>
                  </div>

                  {bus.arrivalTime && bus.arrivalTime !== 'Not Available' && (
                    <p style={{ margin: '5px 0', color: '#28a745', fontWeight: 'bold' }}>
                      🕐 Arrival: {bus.arrivalTime}
                    </p>
                  )}

                  {bus.stops && bus.stops.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                        <strong>Stops:</strong> {bus.stops.join(' → ')}
                      </p>
                    </div>
                  )}

                  <p style={{ 
                    margin: '10px 0 0 0', 
                    fontSize: '12px', 
                    color: '#999',
                    fontStyle: 'italic'
                  }}>
                    Last updated: {new Date(bus.lastUpdated).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bus Details & Map */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <h3>📍 Bus Details & Location</h3>
            {selectedBus ? (
              <div>
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '20px', 
                  borderRadius: '8px', 
                  marginBottom: '20px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <h4 style={{ color: '#007bff', marginBottom: '15px' }}>
                    Bus {(liveBus || selectedBus).busNumber} - Route {(liveBus || selectedBus).routeNumber}
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Source:</p>
                      <p style={{ margin: '5px 0', color: '#666' }}>{(liveBus || selectedBus).source}</p>
                    </div>
                    <div>
                      <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Destination:</p>
                      <p style={{ margin: '5px 0', color: '#666' }}>{(liveBus || selectedBus).destination}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Status:</p>
                    <p style={{ 
                      margin: '5px 0', 
                      color: getStatusColor((liveBus || selectedBus).status),
                      fontWeight: 'bold'
                    }}>
                      {getStatusIcon((liveBus || selectedBus).status)} {(liveBus || selectedBus).status === 'on_time' ? 'On Time' : 'Delayed'}
                    </p>
                  </div>

                  {(liveBus || selectedBus).arrivalTime && (liveBus || selectedBus).arrivalTime !== 'Not Available' && (
                    <div style={{ marginBottom: '15px' }}>
                      <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Expected Arrival:</p>
                      <p style={{ margin: '5px 0', color: '#28a745', fontWeight: 'bold' }}>
                        🕐 {(liveBus || selectedBus).arrivalTime}
                      </p>
                    </div>
                  )}

                  {(liveBus || selectedBus).stops && (liveBus || selectedBus).stops.length > 0 && (
                    <div style={{ marginBottom: '15px' }}>
                      <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Route Stops:</p>
                      <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '10px', 
                        borderRadius: '5px',
                        fontSize: '14px'
                      }}>
                        {(liveBus || selectedBus).stops.map((stop, index) => (
                          <span key={index}>
                            {stop}
                            {index < (liveBus || selectedBus).stops.length - 1 && ' → '}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p style={{ 
                    margin: '10px 0 0 0', 
                    fontSize: '12px', 
                    color: '#999',
                    fontStyle: 'italic'
                  }}>
                    Last updated: {new Date((liveBus || selectedBus).lastUpdated).toLocaleString()}
                  </p>
                </div>

                {/* Map */}
                <div>
                  <h5 style={{ marginBottom: '10px' }}>Current Location:</h5>
                  <BusMap 
                    location={(liveBus && liveBus.currentLocation) ? liveBus.currentLocation : selectedBus.currentLocation} 
                    title={`Bus ${(liveBus || selectedBus).busNumber} - ${(liveBus || selectedBus).source} to ${(liveBus || selectedBus).destination}`}
                  />
                </div>
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: 'gray', 
                fontStyle: 'italic',
                marginTop: '50px'
              }}>
                <p>Select a bus to view details and location</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
