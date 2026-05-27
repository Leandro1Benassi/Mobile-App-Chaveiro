import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Edit2, Trash2, Search } from "lucide-react";
import { useApp } from "../context/AppContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  listarClientes,
  criarCliente,
  atualizarCliente,
  deletarCliente,
} from "../services/clientesService";
import {
  formatCpfCnpj,
  formatPhone,
  getCpfCnpjLabel,
  isValidEmail,
  isValidPhone,
  validateCpfCnpj,
} from "../utils/contactValidation";

type Cliente = {
  id: string;
  nome: string;
  telefone: string;
  cpf?: string;
  email?: string;
  cep?: string;
};

export function CadastroClientes() {
  const { setCurrentScreen } = useApp();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    email: "",
    cep: "",
  });

  //  Buscar clientes da API
  const fetchClientes = async () => {
    try {
      const res = await listarClientes();
      console.log("clientes", res);
      // ajustar formato da API
      const clientesFormatados = res.data.map((c: any) => ({
        id: String(c.id),
        nome: c.name,
        telefone: formatPhone(c.tel || ""),
        email: c.email,
        cpf: formatCpfCnpj(c.cpf || ""),
        cep: c.cep || "",
      }));

      setClientes(clientesFormatados);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      toast.error("Erro ao carregar clientes");
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Criar ou atualizar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPhone(formData.telefone)) {
      toast.error("Telefone invalido. Use DDD + numero com 10 ou 11 digitos.");
      return;
    }

    if (formData.cpf && !validateCpfCnpj(formData.cpf)) {
      toast.error(`${getCpfCnpjLabel(formData.cpf)} invalido. Verifique os numeros digitados.`);
      return;
    }

    if (formData.email && !isValidEmail(formData.email)) {
      toast.error("Email invalido. Verifique o endereco digitado.");
      return;
    }

    try {
      if (editingId) {
        await atualizarCliente(editingId, {
          name: formData.nome,
          tel: formData.telefone,
          cpf: formData.cpf,
          email: formData.email,
          cep: formData.cep,
        });

        toast.success("Cliente atualizado com sucesso!");
      } else {
        await criarCliente({
          name: formData.nome,
          tel: formData.telefone,
          cpf: formData.cpf,
          email: formData.email,
          cep: formData.cep,
        });

        toast.success("Cliente cadastrado com sucesso!");
      }

      await fetchClientes();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      toast.error("Erro ao salvar cliente");
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      telefone: "",
      cpf: "",
      email: "",
      cep: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const updateFormField = (field: keyof typeof formData, value: string) => {
    const formattedValue =
      field === "telefone"
        ? formatPhone(value)
        : field === "cpf"
          ? formatCpfCnpj(value)
          : value;

    setFormData({ ...formData, [field]: formattedValue });
  };

  // Editar
  const handleEdit = (id: string) => {
    const cliente = clientes.find((c) => c.id === id);

    if (cliente) {
      setFormData({
        nome: cliente.nome,
        telefone: formatPhone(cliente.telefone),
        cpf: formatCpfCnpj(cliente.cpf || ""),
        email: cliente.email || "",
        cep: cliente.cep || "",
      });

      setEditingId(id);
      setShowForm(true);
    }
  };

  // Deletar
  const handleDelete = async (id: string) => {
    toast(({ closeToast }) => (
      <div>
        <p>Deseja excluir este cliente?</p>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 10,
            justifyContent: "center",
          }}
        >
          <button
            onClick={async () => {
              await deletarCliente(id);
              fetchClientes();
              toast.success("Cliente excluído!");
              closeToast();
            }}
          >
            Sim
          </button>

          <button onClick={closeToast}>Cancelar</button>
        </div>
      </div>
    ));
  };
  // Filtro
  const filteredClientes = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.telefone.includes(searchTerm),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/*  TOAST (OBRIGATÓRIO) */}
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentScreen("dashboard")}
            className="p-2 hover:bg-purple-700 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1>Clientes</h1>
            <p className="text-purple-100 mt-1">
              {clientes.length} cadastrado(s)
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="p-2 bg-purple-700 hover:bg-purple-800 rounded-lg"
            >
              <Plus className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Formulário */}
        {showForm && (
          <div className="bg-white rounded-lg p-4 shadow mb-4">
            <h2 className="text-gray-800 mb-4">
              {editingId ? "Editar Cliente" : "Novo Cliente"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Telefone (WhatsApp) *
                </label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => updateFormField("telefone", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="(11) 98765-4321"
                  inputMode="tel"
                  maxLength={15}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">CPF ou CNPJ</label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => updateFormField("cpf", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  inputMode="numeric"
                  maxLength={18}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormField("email", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="cliente@email.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Endereço</label>
                <textarea
                  value={formData.cep}
                  onChange={(e) =>
                    setFormData({ ...formData, cep: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                >
                  {editingId ? "Atualizar" : "Cadastrar"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Busca */}
        {!showForm && (
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou telefone..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        )}

        {/* Lista de Clientes */}
        {!showForm && (
          <div className="space-y-3">
            {filteredClientes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? "Nenhum cliente encontrado"
                  : "Nenhum cliente cadastrado"}
              </div>
            ) : (
              filteredClientes.map((cliente) => (
                <div
                  key={cliente.id}
                  className="bg-white rounded-lg p-4 shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-gray-800">{cliente.nome}</p>
                      <p className="text-gray-600 mt-1">{cliente.telefone}</p>
                      {cliente.email && (
                        <p className="text-gray-500 mt-1">{cliente.email}</p>
                      )}
                      {cliente.cpf && (
                        <p className="text-gray-500">{getCpfCnpjLabel(cliente.cpf)}: {cliente.cpf}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(cliente.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cliente.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
