import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import busIconImg from '../assets/bus-marker.png';

// Fix Leaflet's default icon path issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const busIcon = new L.Icon({
  iconUrl: busIconImg,
  iconSize: [30, 30],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

/**
 * BusMap Component
 * @param {Object} props
 * @param {{lat: number, lng: number}} [props.location] - Single bus location coordinates
 * @param {string} [props.title] - Optional popup text (e.g. bus number or route)
 * @param {number} [props.zoom] - Optional zoom level (default: 15)
 * @param {Array} [props.buses] - Optional array of bus objects to show multiple pins
 */
function BusMap({ location, title = "Bus is here 🚍", zoom = 15, buses }) {
  // Defensive: If buses prop is provided, show all buses on the map
  if (buses && Array.isArray(buses) && buses.length > 0) {
    // Center map on the first bus, or default location if none
    const center = buses[0].currentLocation && buses[0].currentLocation.lat && buses[0].currentLocation.lng
      ? [buses[0].currentLocation.lat, buses[0].currentLocation.lng]
      : [16.4649, 80.5083];
    return (
      <div style={{ width: '100%', minHeight: 300, height: 500 }}>
        <MapContainer 
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%', marginTop: '10px' }}
          key={buses.map(b => b.busNumber).join('-')}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          {buses.map(bus => (
            bus.currentLocation && bus.currentLocation.lat && bus.currentLocation.lng && (
              <Marker key={bus.busNumber} position={[bus.currentLocation.lat, bus.currentLocation.lng]} icon={busIcon}>
                <Popup>
                  <strong>Bus {bus.busNumber}</strong><br/>
                  Route: {bus.routeNumber}<br/>
                  Status: {bus.status}<br/>
                  Last Updated: {bus.lastUpdated ? new Date(bus.lastUpdated).toLocaleString() : 'N/A'}
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>
    );
  }

  // Defensive: Fallback for single bus location
  if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number' || isNaN(location.lat) || isNaN(location.lng)) {
    return <p style={{ color: 'gray', fontStyle: 'italic' }}>📍 Location not available</p>;
  }

  return (
    <div style={{ width: '100%', minHeight: 200, height: 300 }}>
      <MapContainer 
        center={[location.lat, location.lng]} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', marginTop: '10px' }}
        key={`${location.lat}-${location.lng}`} // Force re-render when location changes
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        <Marker position={[location.lat, location.lng]} icon={busIcon}>
          <Popup>{title}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default BusMap;
