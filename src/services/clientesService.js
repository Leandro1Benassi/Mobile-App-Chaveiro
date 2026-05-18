import api from "./api";

export const listarClientes = async () => {
  const res = await api.get("/clientes");
  return res.data;
};

export const criarCliente = async (data) => {
  const res = await api.post("/clientes", data);
  console.log(res);
  return res.data;
};

export const atualizarCliente = async (id, data) => {
  const res = await api.put(`/clientes/${id}`, data);
  return res.data;
};

export const deletarCliente = async (id) => {
  await api.delete(`/clientes/${id}`);
};

export default {
  listarClientes,
  criarCliente,
  atualizarCliente,
  deletarCliente,
};
