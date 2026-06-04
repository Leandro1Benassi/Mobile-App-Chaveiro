import { useState } from "react";
import { ArrowLeft, Plus, Filter, Package, MessageCircle } from "lucide-react";
import { useApp, OrdemServico } from "../context/AppContext";
import { WhatsAppModal } from "./WhatsAppModal";

export function CopiaChave() {
  const {
    setCurrentScreen,
    ordens,
    clientes,
    produtos,
    addOrdem,
    updateOrdem,
    getClienteById,
    getProdutoById,
  } = useApp();
  const [showForm, setShowForm] = useState(false);

  //const [filterStatus, setFilterStatus] = useState<OrdemServico | "all">("all");
  type StatusOrdem = OrdemServico["status_ordem"];

  const [filterStatus, setFilterStatus] = useState<StatusOrdem | "all">("all");
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [selectedOrdemForWhatsApp, setSelectedOrdemForWhatsApp] = useState<
    string | null
  >(null);
  const [formData, setFormData] = useState({
    clienteId: "",
    observacao: "",
    status_ordem: "ABERTA" as OrdemServico["status_ordem"],
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //const produto = getProdutoById(formData.produtoId);

    //{ if (!produto || produto.quantidadeEstoque === 0) {
    //alert("Produto sem estoque disponível!");
    //  return;
    // }

    try {
      await addOrdem({
        id_cliente: Number(formData.clienteId),
        id_empresa: 1, // empresa logada
        observacao: `Cópia de chave - ${formData.observacao}`,
        status_ordem: "ABERTA",
        valor_total: 0,
      });

      resetForm();

      alert("Ordem de serviço criada com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar ordem de serviço");
    }
  };
  const resetForm = () => {
    setFormData({
      clienteId: "",
      observacao: "",
      status_ordem: "PENDENTE",
    });
    setShowForm(false);
  };

  const handleStatusChange = async (
    id: string,
    newStatus: OrdemServico["status_ordem"],
  ) => {
    const ordemAtual = ordens.find((o) => String(o.id) === id);

    if (newStatus === "PRONTO" && ordemAtual?.status_ordem !== "PRONTO") {
      await updateOrdem(id, {
        status_ordem: newStatus,
      });

      setSelectedOrdemForWhatsApp(id);
      setShowWhatsAppModal(true);
    } else {
      await updateOrdem(id, {
        status_ordem: newStatus,
      });
    }
  };

  const handleWhatsAppSend = (ordemId: string) => {
    setSelectedOrdemForWhatsApp(ordemId);
    setShowWhatsAppModal(true);
  };

  const handleWhatsAppModalClose = () => {
    setShowWhatsAppModal(false);
    setSelectedOrdemForWhatsApp(null);
  };

  const handlePrepareRetirada = (id: string) => {
    setCurrentScreen("retirada");
    sessionStorage.setItem("currentOrdemId", id);
  };

  const getStatusColor = (status_ordem: OrdemServico["status_ordem"]) => {
    switch (status_ordem) {
      case "ABERTA":
        return "bg-yellow-100 text-yellow-700";

      case "EM_ANDAMENTO":
        return "bg-blue-100 text-blue-700";

      case "PRONTO":
        return "bg-green-100 text-green-700";

      case "ENTREGUE":
        return "bg-gray-100 text-gray-700";

      case "PENDENTE":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status_ordem: OrdemServico["status_ordem"]) => {
    switch (status_ordem) {
      case "ABERTA":
        return "ABERTA";

      case "EM_ANDAMENTO":
        return "EM_ANDAMENTO";

      case "PRONTO":
        return "PRONTO";

      case "ENTREGUE":
        return "ENTREGUE";

      case "PENDENTE":
        return "PENDENTE";

      default:
        return status_ordem;
    }
  };
  const filteredOrdens = ordens.filter(
    (o) => filterStatus === "all" || o.status_ordem === filterStatus,
  );

  const selectedOrdem = selectedOrdemForWhatsApp
    ? ordens.find((o) => String(o.id) === selectedOrdemForWhatsApp)
    : null;

  const selectedCliente = selectedOrdem
    ? getClienteById(String(selectedOrdem.id_cliente))
    : null;

  // não existe mais produtoId na OS
  const selectedProduto = null;
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentScreen("dashboard")}
            className="p-2 hover:bg-blue-700 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1>Ordens de Serviço</h1>
            <p className="text-blue-100 mt-1">
              {ordens.filter((o) => o.status_ordem !== "ENTREGUE").length}{" "}
              aberta(s)
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="p-2 bg-blue-700 hover:bg-blue-800 rounded-lg"
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
            <h2 className="text-gray-800 mb-4">Nova Ordem de Serviço</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Cliente *</label>
                <select
                  value={formData.clienteId}
                  onChange={(e) =>
                    setFormData({ ...formData, clienteId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.name} - {cliente.tel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Chave Original (Código/Referência) *
                </label>
                <input
                  type="text"
                  value={formData.observacao}
                  onChange={(e) =>
                    setFormData({ ...formData, observacao: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: YL-1234"
                  required
                />
              </div>

              {/*
<div>
  <label className="block text-gray-700 mb-2">
    Tipo de Matriz *
  </label>

  <select
    value={formData.produtoId}
    onChange={(e) =>
      setFormData({ ...formData, produtoId: e.target.value })
    }
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  >
    <option value="">Selecione uma matriz</option>

    {produtos.map((produto) => (
      <option
        key={produto.id}
        value={produto.id}
        disabled={produto.quantidadeEstoque === 0}
      >
        {produto.nome} ({produto.codigo}) - Estoque:{" "}
        {produto.quantidadeEstoque}
      </option>
    ))}
  </select>
</div>
*/}

              <div>
                <label className="block text-gray-700 mb-2">
                  Status Inicial *
                </label>
                <select
                  value={formData.status_ordem}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status_ordem: e.target
                        .value as OrdemServico["status_ordem"],
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="EM_ANDAMENTO">Em andamento</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Criar Ordem
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

        {/* Filtros */}
        {!showForm && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Filtrar por status:</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  filterStatus === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterStatus("PENDENTE")}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  filterStatus === "PENDENTE"
                    ? "bg-yellow-600 text-white"
                    : "bg-white text-gray-700 border"
                }`}
              >
                Pendente
              </button>
              <button
                onClick={() => setFilterStatus("EM_ANDAMENTO")}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  filterStatus === "EM_ANDAMENTO"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border"
                }`}
              >
                Em Produção
              </button>
              <button
                onClick={() => setFilterStatus("PRONTO")}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  filterStatus === "PRONTO"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 border"
                }`}
              >
                Pronto
              </button>
              <button
                onClick={() => setFilterStatus("ENTREGUE")}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  filterStatus === "ENTREGUE"
                    ? "bg-gray-600 text-white"
                    : "bg-white text-gray-700 border"
                }`}
              >
                Retirado
              </button>
            </div>
          </div>
        )}

        {/* Lista de Ordens */}
        {/*
        {!showForm && (
          <div className="space-y-3">
            {filteredOrdens.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {filterStatus === "all"
                  ? "Nenhuma ordem cadastrada"
                  : "Nenhuma ordem com este status"}
              </div>
            ) : (
              filteredOrdens
                .sort(
                  (a, b) =>
                    new Date(b.dataCriacao).getTime() -
                    new Date(a.dataCriacao).getTime(),
                )
                .map((ordem) => {
                  //const cliente = getClienteById(ordem.clienteId);
                 // const produto = getProdutoById(ordem.produtoId);

                  return (
                    <div
                      key={ordem.id}
                      className="bg-white rounded-lg p-4 shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-gray-800">
                            {cliente?.name || "Cliente não encontrado"}
                          </p>
                          <p className="text-gray-600 mt-1">
                            {produto?.nome || "Produto não encontrado"} - Ref:{" "}
                            {ordem.observacao}
                          </p>
                          <p className="text-gray-500">
                            {new Date(ordem.dataCriacao).toLocaleDateString(
                              "pt-BR",
                            )}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full ${getStatusColor(ordem.status_ordem)}`}
                        >
                          {getStatusLabel(ordem.status_ordem)}
                        </span>
                      </div>

                      {ordem.status_ordem !== "ENTREGUE" && (
                        <div className="space-y-2">
                          <label className="block text-gray-700">
                            Atualizar Status:
                          </label>
                          <select
                            value={ordem.status_ordem}
                            onChange={(e) =>
                              handleStatusChange(
                                ordem.id,
                                e.target.value as StatusOrdem,
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="PENDENTE">Pendente</option>
                            <option value="EM_ANDAMENTO">Em Produção</option>
                            <option value="PRONTO">Pronto para Retirada</option>
                          </select>

                          <div className="flex gap-2">
                            {ordem.status_ordem === "PRONTO" && (
                              <>
                                <button
                                  onClick={() => handleWhatsAppSend(ordem.id)}
                                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                                >
                                  <MessageCircle className="w-5 h-5" />
                                  Enviar WhatsApp
                                </button>
                                <button
                                  onClick={() =>
                                    handlePrepareRetirada(ordem.id)
                                  }
                                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                                >
                                  <Package className="w-5 h-5" />
                                  Processar Retirada
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        )}
         */}

        {!showForm && (
          <div className="space-y-3">
            {filteredOrdens.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma ordem cadastrada
              </div>
            ) : (
              filteredOrdens
                .sort(
                  (a, b) =>
                    new Date(b.data_entrada || "").getTime() -
                    new Date(a.data_entrada || "").getTime(),
                )
                .map((ordem) => {
                  const cliente = clientes.find(
                    (c) => c.id === ordem.id_cliente,
                  );

                  return (
                    <div
                      key={ordem.id}
                      className="bg-white rounded-lg p-4 shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium">
                            {cliente?.nome ||
                              cliente?.name ||
                              "Cliente não encontrado"}
                          </p>

                          <p className="text-gray-600 mt-1">
                            {ordem.observacao}
                          </p>

                          <p className="text-gray-500 text-sm mt-1">
                            Entrada:{" "}
                            {ordem.data_entrada
                              ? new Date(ordem.data_entrada).toLocaleDateString(
                                  "pt-BR",
                                )
                              : "-"}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full ${getStatusColor(
                            ordem.status_ordem,
                          )}`}
                        >
                          {getStatusLabel(ordem.status_ordem)}
                        </span>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}
      </div>

      {/* WhatsApp Modal */}
      {selectedCliente && selectedProduto && (
        <WhatsAppModal
          isOpen={showWhatsAppModal}
          onClose={handleWhatsAppModalClose}
          onSend={handleWhatsAppModalClose}
          cliente={selectedCliente}
          //produtoNome={selectedProduto.nome}
        />
      )}
    </div>
  );
}
