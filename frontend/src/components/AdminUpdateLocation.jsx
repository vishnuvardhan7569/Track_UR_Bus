import { useState } from 'react';
import axios from 'axios';

function AdminUpdateLocation() {
  const [busNumber, setBusNumber] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [msg, setMsg] = useState('');

  const handleUpdate = async () => {
    try {
      const res = await axios.put('http://localhost:5000/api/buses/update-location', {
        busNumber,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      });

      setMsg(res.data.msg);
    } catch (err) {
      setMsg('❌ Error updating location');
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>🧭 Update Bus Location</h3>
      <input placeholder="Bus Number" value={busNumber} onChange={(e) => setBusNumber(e.target.value)} />
      <br /><br />
      <input placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} />
      <br /><br />
      <input placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} />
      <br /><br />
      <button onClick={handleUpdate}>Update</button>
      <p>{msg}</p>
    </div>
  );
}

export default AdminUpdateLocation;
