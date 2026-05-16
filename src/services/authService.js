import api from "./api";

export const login = async (email, senha) => {
  const res = await api.post("/usuarios/login", {
    email,
    senha,
  });

  // salva token
  localStorage.setItem("token", res.data.token);

  // salva usuário
  localStorage.setItem("user", JSON.stringify(res.data.user));

  return res.data;
};

// logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// pegar usuário
export const getUser = () => {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};
