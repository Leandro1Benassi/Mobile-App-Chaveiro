import axios from "axios";

// BASE DA API
export const API_BASE_URL = "https://api.bennaweb.com";

// BASE DAS IMAGENS (UPLOADS)
export const UPLOADS_URL = `${API_BASE_URL}/uploads`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// interceptor de token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
