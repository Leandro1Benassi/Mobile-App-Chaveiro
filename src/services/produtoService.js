import api from "./api";

// =========================
// LISTAR
// =========================

export const listarProdutos = async () => {
  const response = await api.get("/produtos");

  return response.data;
};

// =========================
// CRIAR
// =========================

export const criarProduto = async (formData) => {
  const response = await api.post("/produtos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// =========================
// ATUALIZAR
// =========================

export const atualizarProduto = async (id, formData) => {
  const response = await api.put(`/produtos/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// =========================
// DELETAR
// =========================

export const deletarProduto = async (id) => {
  const response = await api.delete(`/produtos/${id}`);
  console.log("delete", response);
  return response.data;
};

export default {
  listarProdutos,
  criarProduto,
  atualizarProduto,
  deletarProduto,
};
