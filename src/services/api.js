import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bennaweb.com/',
});

export default api;