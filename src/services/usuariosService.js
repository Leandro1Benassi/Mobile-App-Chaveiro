import { ApertureIcon, SaudiRiyal } from "lucide-react";
import api from "./api";

// LISTAR
export const listarUsuarios = async () => {
  const res = await api.get("/usuarios");
  return res.data;
};

// CRIAR
export const criarUsuarios = async (data) => {
  const res = await api.post("/usuarios", data);
  return res.data;
};

// LOGIN
export const login = async (email, senha) => {
  const res = await api.post("/login", {
    email,
    senha,
  });

  // salva token
  localStorage.setItem("token", res.data.token);

  // salva usuário opcional
  localStorage.setItem("user", JSON.stringify(res.data.user));

  return res.data;
};
