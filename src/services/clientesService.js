import api from './api';

export const listarClientes = async () => {
  const res = await api.get('/clientes');
  return res.data;
};

export const criarCliente = async (data) => {
  const res = await api.post('/clientes', data);
  return res.data;
};