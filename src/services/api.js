import axios from "axios";

export const API_BASE_URL = "https://api.bennaweb.com";
export const UPLOADS_URL = `${API_BASE_URL}/uploads`;

// Cache em memória (ajuda em dispositivos móveis)
let cachedToken = null;

// Salva ou remove token
export const setAuthToken = (token) => {
  cachedToken = token;

  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

// Recupera token
export const getAuthToken = () => {
  return cachedToken || localStorage.getItem("token");
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Carrega token ao iniciar aplicação
cachedToken = localStorage.getItem("token");

// Interceptor para adicionar Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    // Rotas públicas
    if (
      config.url?.includes("/usuarios/login") ||
      config.url?.includes("/usuarios/register")
    ) {
      return config;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor para tratar token expirado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("Sessão expirada");

      setAuthToken(null);
      localStorage.removeItem("user");

      // opcional:
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
