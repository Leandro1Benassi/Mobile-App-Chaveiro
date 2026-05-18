import api from "./api";
export const listarServicos = async () => {
  const res = await api.get("/servicos");
  return res.data;
};

export const criarServicos = async (data) => {
  const res = await api.post("/servicos", data);
  console.log(res.data);
  return res.data;
};

export const atualizarServicos = async (id, data) => {
  const res = await api.put(`/servicos/${id}`, data);
  return res.data;
};

export const deletarServicos = async (id) => {
  await api.delete(`/servicos/${id}`);
};

export default {
  listarServicos,
  criarServicos,
  atualizarServicos,
  deletarServicos,
};
