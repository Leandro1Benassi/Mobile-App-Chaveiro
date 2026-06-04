import api from "./api";

// =========================
// LISTAR
// =========================

export const listarOs = async () => {
  const response = await api.get("/os");

  return response.data;
};

// =========================
// CRIAR
// =========================
export const criarOs = async (data) => {
  const response = await api.post("/os", data);
  return response.data;
};

export const atualizarOs = async (id, data) => {
  const response = await api.put(`/os/${id}`, data);
  return response.data;
};

// =========================
// DELETAR
// =========================

export const deletarOs = async (id) => {
  const response = await api.delete(`/os/${id}`);
  console.log("delete", response);
  return response.data;
};

export default {
  listarOs,
  criarOs,
  atualizarOs,
  deletarOs,
};
