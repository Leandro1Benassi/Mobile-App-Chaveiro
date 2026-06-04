import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Filter,
  Package,
  MessageCircle,
  Printer,
  Wrench,
} from "lucide-react";
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

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("pt-BR");
  };

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const handlePrintOrdem = (ordem: OrdemServico) => {
    const cliente = clientes.find((c) => c.id === ordem.id_cliente);
    const clienteNome =
      cliente?.nome || cliente?.name || "Cliente não encontrado";
    const clienteTelefone = cliente?.telefone || cliente?.tel || "-";
    const observacao = ordem.observacao || "-";
    const printableWindow = window.open("", "_blank", "width=800,height=900");

    if (!printableWindow) {
      alert("Não foi possível abrir a janela de impressão.");
      return;
    }

    printableWindow.document.write(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <title>Ordem de Serviço #${ordem.id}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 32px;
              color: #111827;
              font-family: Arial, sans-serif;
              background: #ffffff;
            }
            .page {
              max-width: 720px;
              margin: 0 auto;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              padding: 28px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              gap: 16px;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }
            h1 { margin: 0; font-size: 24px; }
            .company { color: #2563eb; font-weight: 700; margin-top: 4px; }
            .badge {
              border: 1px solid #d1d5db;
              border-radius: 999px;
              padding: 8px 12px;
              font-size: 12px;
              font-weight: 700;
              height: fit-content;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
            }
            .field {
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 10px;
            }
            .field.full { grid-column: 1 / -1; }
            .label {
              color: #6b7280;
              font-size: 12px;
              margin-bottom: 4px;
              text-transform: uppercase;
            }
            .value { font-size: 16px; }
            .signature {
              margin-top: 56px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 32px;
            }
            .line {
              border-top: 1px solid #111827;
              padding-top: 8px;
              text-align: center;
              color: #374151;
              font-size: 13px;
            }
            @media print {
              body { padding: 0; }
              .page { border: none; }
            }
          </style>
        </head>
        <body>
          <main class="page">
            <section class="header">
              <div>
                <h1>Ordem de Serviço #${ordem.id}</h1>
                <div class="company">Chaves Alves</div>
              </div>
              <div class="badge">${getStatusLabel(ordem.status_ordem)}</div>
            </section>

            <section class="grid">
              <div class="field">
                <div class="label">Cliente</div>
                <div class="value">${escapeHtml(clienteNome)}</div>
              </div>
              <div class="field">
                <div class="label">Telefone</div>
                <div class="value">${escapeHtml(clienteTelefone)}</div>
              </div>
              <div class="field">
                <div class="label">Entrada</div>
                <div class="value">${formatDate(ordem.data_entrada)}</div>
              </div>
              <div class="field">
                <div class="label">Entrega</div>
                <div class="value">${formatDate(ordem.data_entrega)}</div>
              </div>
              <div class="field">
                <div class="label">Valor total</div>
                <div class="value">R$ ${Number(ordem.valor_total || 0).toFixed(2)}</div>
              </div>
              <div class="field">
                <div class="label">Status</div>
                <div class="value">${getStatusLabel(ordem.status_ordem)}</div>
              </div>
              <div class="field full">
                <div class="label">Observação</div>
                <div class="value">${escapeHtml(observacao)}</div>
              </div>
            </section>

            <section class="signature">
              <div class="line">Assinatura do cliente</div>
              <div class="line">Responsável</div>
            </section>
          </main>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `);

    printableWindow.document.close();
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
          <div className="flex-1 relative pl-8">
            <Wrench className="absolute left-0 top-0.5 w-6 h-6" />
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
                        <div className="flex-1 pr-3">
                          <div className="flex items-center gap-2">
                            <Wrench className="w-5 h-5 text-blue-600" />
                            <p className="text-gray-800 font-medium">
                            {cliente?.nome ||
                              cliente?.name ||
                              "Cliente não encontrado"}
                            </p>
                          </div>

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

                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handlePrintOrdem(ordem)}
                          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-700 hover:bg-gray-200"
                        >
                          <Printer className="w-4 h-4" />
                          Imprimir
                        </button>
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
