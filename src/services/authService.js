import api, { setAuthToken } from "./api";
export const loginWithGoogle = async () => {
  throw new Error("Login com Google não implementado ainda");
};
export const login = async (email, senha) => {
  try {
    const response = await api.post("/usuarios/login", {
      email: email?.trim(),
      senha: senha?.trim(),
    });

    const { user, token } = response.data;

    if (!token) {
      console.log("LOGIN SEM TOKEN:", response.data);
      return null;
    }

    // salva token IMEDIATAMENTE em memória + storage
    setAuthToken(token);

    localStorage.setItem("user", JSON.stringify(user));

    console.log("TOKEN SALVO:", token);

    return response.data;
  } catch (error) {
    console.log("ERRO LOGIN:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
