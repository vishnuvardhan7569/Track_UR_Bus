import axios from 'axios';

export const searchBusesByStop = async (stop) => {
  const response = await axios.get('http://localhost:5000/api/buses/search/stop', {
    params: { stop }
  });
  return response.data;
};

export const fetchAllBusesForDropdown = async () => {
  const response = await axios.get('http://localhost:5000/api/buses/test');
  return response.data.buses;
};
