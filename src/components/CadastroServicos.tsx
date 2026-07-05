import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Edit2, Trash2, Search } from "lucide-react";
import { useApp } from "../context/AppContext";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  listarServicos,
  criarServicos,
  atualizarServicos,
  deletarServicos,
} from "../services/servicosService";

type Servico = {
  id: string;
  nome: string;
  valor: number;
  duracaoEstimada?: string;
};

export function CadastroServicos() {
  const { setCurrentScreen } = useApp();

  const [servicos, setServicos] = useState<Servico[]>([]);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    valor: 0,
    duracaoEstimada: "",
  });

  // =========================
  // BUSCAR SERVIÇOS
  // =========================

  const fetchServicos = async () => {
    try {
      const res = await listarServicos();

      const servicosFormatados = res.data.map((s: any) => ({
        id: String(s.id),
        nome: s.nome,
        valor: Number(s.valor),
        duracaoEstimada: s.duracaoEstimada || "",
      }));

      setServicos(servicosFormatados);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);

      toast.error("Erro ao carregar serviços");
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  // =========================
  // CRIAR / EDITAR
  // =========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await atualizarServicos(editingId, {
          nome: formData.nome,
          valor: formData.valor,
          duracaoEstimada: formData.duracaoEstimada,
        });

        toast.success("Serviço atualizado com sucesso!");
      } else {
        await criarServicos({
          nome: formData.nome,
          valor: formData.valor,
          duracaoEstimada: formData.duracaoEstimada,
        });

        toast.success("Serviço cadastrado com sucesso!");
      }

      await fetchServicos();

      resetForm();
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);

      toast.error("Erro ao salvar serviço");
    }
  };

  // =========================
  // RESET
  // =========================

  const resetForm = () => {
    setFormData({
      nome: "",
      valor: 0,
      duracaoEstimada: "",
    });

    setEditingId(null);

    setShowForm(false);
  };

  // =========================
  // EDITAR
  // =========================

  const handleEdit = (id: string) => {
    const servico = servicos.find((s) => s.id === id);

    if (servico) {
      setFormData({
        nome: servico.nome,
        valor: servico.valor,
        duracaoEstimada: servico.duracaoEstimada || "",
      });

      setEditingId(id);

      setShowForm(true);
    }
  };

  // =========================
  // DELETAR
  // =========================

  const handleDelete = async (id: string) => {
    toast(({ closeToast }) => (
      <div>
        <p>Deseja excluir este serviço?</p>

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
              await deletarServicos(id);

              fetchServicos();

              toast.success("Serviço excluído!");

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

  // =========================
  // FILTRO
  // =========================

  const filteredServicos = servicos.filter((s) =>
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* HEADER */}
      <div className="bg-indigo-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentScreen("dashboard")}
            className="p-2 hover:bg-indigo-700 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex-1">
            <h1>Serviços</h1>

            <p className="text-indigo-100 mt-1">
              {servicos.length} cadastrado(s)
            </p>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="p-2 bg-indigo-700 hover:bg-indigo-800 rounded-lg"
            >
              <Plus className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* FORM */}
        {showForm && (
          <div className="bg-white rounded-lg p-4 shadow mb-4">
            <h2 className="text-gray-800 mb-4">
              {editingId ? "Editar Serviço" : "Novo Serviço"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nome: e.target.value,
                  })
                }
                placeholder="Nome do serviço"
                className="w-full border rounded-lg p-2"
                required
              />

              <input
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    valor: Number(e.target.value),
                  })
                }
                placeholder="Valor"
                className="w-full border rounded-lg p-2"
                required
              />

              <input
                type="text"
                value={formData.duracaoEstimada}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duracaoEstimada: e.target.value,
                  })
                }
                placeholder="Duração estimada"
                className="w-full border rounded-lg p-2"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
                >
                  {editingId ? "Atualizar" : "Cadastrar"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* BUSCA */}
        {!showForm && (
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar serviço..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* LISTA */}
        {!showForm && (
          <div className="space-y-3">
            {filteredServicos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum serviço cadastrado
              </div>
            ) : (
              filteredServicos.map((servico) => (
                <div
                  key={servico.id}
                  className="bg-white rounded-lg p-4 shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-800">{servico.nome}</p>

                      <p className="text-green-600 mt-1">
                        R$ {servico.valor.toFixed(2)}
                      </p>

                      <p className="text-gray-500 mt-1">
                        {servico.duracaoEstimada}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(servico.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDelete(servico.id)}
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
