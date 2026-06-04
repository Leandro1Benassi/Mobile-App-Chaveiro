import axios from "axios";

export const API_BASE_URL = "https://api.bennaweb.com";
export const UPLOADS_URL = `${API_BASE_URL}/uploads`;

//  cache em memória (ESSENCIAL no Android)
let cachedToken = null;

export const setAuthToken = (token) => {
  cachedToken = token;
  localStorage.setItem("token", token);
};

export const getAuthToken = () => {
  return cachedToken || localStorage.getItem("token");
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

// interceptor
api.interceptors.request.use((config) => {
  const token = getAuthToken();

  // NÃO interceptar login
  if (config.url?.includes("/usuarios/login")) {
    return config;
  }

  console.log("AUTH TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
