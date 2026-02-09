import axios from 'axios';

const api = axios.create({
  baseURL: 'https://scm-enterprise-production.up.railway.app/api',
});

// Otomatis tempelkan Token jika ada di local storage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;