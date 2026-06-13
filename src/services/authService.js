import api, { setAuthToken } from "./api";

// =========================
// LOGIN
// =========================
export const login = async (email, senha) => {
  const response = await api.post("/usuarios/login", {
    email: email?.trim(),
    senha,
  });

  const { user, token } = response.data;

  if (!token) {
    throw new Error("Token não retornado pela API");
  }

  setAuthToken(token);
  //localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  return response.data;
};

// =========================
// CADASTRO EMPRESA
// =========================
export const register = async ({
  empresaNome,
  cnpj,
  telefone,
  emailEmpresa,
  name,
  email,
  senha,
}) => {
  const response = await api.post("/usuarios/register", {
    empresaNome,
    cnpj,
    telefone,
    emailEmpresa,
    name,
    email,
    senha,
  });

  const { user, token } = response.data;

  if (token) {
    setAuthToken(token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  return response.data;
};

// =========================
// LOGIN GOOGLE
// =========================
export const loginWithGoogle = async (googleToken) => {
  console.log("ENVIANDO TOKEN PARA API");

  const response = await api.post("/usuarios/google-login", {
    token: googleToken,
  });

  console.log("RESPOSTA API:", response.data);

  const { user, token } = response.data;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  setAuthToken(token);

  return response.data;
};
// =========================
// PERFIL
// =========================
export const getProfile = async () => {
  const response = await api.get("/usuarios/me");
  return response.data;
};

// =========================
// ATUALIZAR PERFIL
// =========================
export const updateProfile = async (dados) => {
  const response = await api.put("/usuarios/profile", dados);
  return response.data;
};

// =========================
// ALTERAR SENHA
// =========================
export const changePassword = async (senhaAtual, novaSenha) => {
  const response = await api.put("/usuarios/senha", {
    senhaAtual,
    novaSenha,
  });

  return response.data;
};

// =========================
// USUÁRIOS DA EMPRESA
// =========================
export const getUsers = async () => {
  const response = await api.get("/usuarios");
  return response.data;
};

// =========================
// CADASTRAR USUÁRIO
// =========================
export const createUser = async ({ name, email, senha, nivel }) => {
  const response = await api.post("/usuarios/cadastrar", {
    name,
    email,
    senha,
    nivel,
  });

  return response.data;
};

// =========================
// LOGOUT
// =========================
export const logout = () => {
  setAuthToken(null);
  localStorage.removeItem("user");
};

// =========================
// USUÁRIO LOGADO
// =========================
export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

// =========================
// TOKEN
// =========================
export const getToken = () => {
  return localStorage.getItem("token");
};

// =========================
// AUTENTICADO
// =========================
export const isAuthenticated = () => {
  return !!getToken();
};
