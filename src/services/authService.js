import api from "./api";

export const login = async (email, senha) => {
  const endpoints = ["/usuarios/login", "/login"];
  const payloads = [
    { email, senha },
    { email, password: senha },
  ];
  let response;
  let lastError;

  for (const endpoint of endpoints) {
    for (const payload of payloads) {
      try {
        response = await api.post(endpoint, payload);
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (response) break;
  }

  if (!response) {
    throw lastError;
  }

  const user =
    response.data.user ||
    response.data.usuario ||
    response.data.data?.user ||
    response.data.data?.usuario ||
    (response.data.email || response.data.id ? response.data : null);
  const token =
    response.data.token ||
    response.data.access_token ||
    response.data.data?.token;

  if (token) {
    localStorage.setItem("token", token);
  }

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  return {
    ...response.data,
    token,
    user,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getUser = () => {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};
