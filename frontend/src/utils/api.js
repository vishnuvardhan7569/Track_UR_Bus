import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const searchBusesByStop = async (stop) => {
  const response = await axios.get(`${API_BASE_URL}/buses/search/stop`, {
    params: { stop }
  });
  return response.data;
};

export const fetchAllBusesForDropdown = async () => {
  const response = await axios.get(`${API_BASE_URL}/buses/test`);
  return response.data.buses;
};
