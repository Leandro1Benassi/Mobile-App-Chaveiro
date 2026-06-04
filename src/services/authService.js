import api from "./api";

const getNestedValue = (data, keys) => {
  for (const key of keys) {
    const value = key
      .split(".")
      .reduce((current, part) => current?.[part], data);

    if (value) return value;
  }

  return null;
};

export const login = async (email, senha) => {
  const endpoints = ["/usuarios/login"];
  const payloads = [
    {
      email: email?.trim(),
      senha: senha?.trim(),
    },
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

  const user = getNestedValue(response.data, [
    "user",
    "usuario",
    "data.user",
    "data.usuario",
    "data",
  ]);
  const token = getNestedValue(response.data, [
    "token",
    "access_token",
    "accessToken",
    "data.token",
    "data.access_token",
    "data.accessToken",
  ]);
  const normalizedUser =
    user && typeof user === "object"
      ? user
      : {
          id: email,
          email,
          nome: email.split("@")[0],
          nivel: "operador",
        };

  if (token) {
    localStorage.setItem("token", token);
    console.log("TOKEN SALVO", token);
  }

  localStorage.setItem("user", JSON.stringify(normalizedUser));

  return {
    ...response.data,
    token,
    user: normalizedUser,
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
