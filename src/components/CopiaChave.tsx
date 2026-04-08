import { useState } from 'react';
import { ArrowLeft, Plus, Filter, Package, MessageCircle } from 'lucide-react';
import { useApp, StatusOrdem } from '../context/AppContext';
import { WhatsAppModal } from './WhatsAppModal';

export function CopiaChave() {
  const { setCurrentScreen, ordens, clientes, produtos, addOrdem, updateOrdem, getClienteById, getProdutoById } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<StatusOrdem | 'all'>('all');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [selectedOrdemForWhatsApp, setSelectedOrdemForWhatsApp] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    clienteId: '',
    chaveOriginal: '',
    produtoId: '',
    status: 'pendente' as StatusOrdem,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se há estoque
    const produto = getProdutoById(formData.produtoId);
    if (!produto || produto.quantidadeEstoque === 0) {
      alert('Produto sem estoque disponível!');
      return;
    }

    addOrdem(formData);
    resetForm();
    alert('Ordem de serviço criada com sucesso! Matriz reservada do estoque.');
  };

  const resetForm = () => {
    setFormData({ clienteId: '', chaveOriginal: '', produtoId: '', status: 'pendente' });
    setShowForm(false);
  };

  const handleStatusChange = (id: string, newStatus: StatusOrdem) => {
    const ordemAtual = ordens.find(o => o.id === id);
    
    // Se mudou para "pronto", perguntar se quer enviar WhatsApp
    if (newStatus === 'pronto' && ordemAtual?.status !== 'pronto') {
      updateOrdem(id, { status: newStatus });
      setSelectedOrdemForWhatsApp(id);
      setShowWhatsAppModal(true);
    } else {
      updateOrdem(id, { status: newStatus });
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
    setCurrentScreen('retirada');
    sessionStorage.setItem('currentOrdemId', id);
  };

  const getStatusColor = (status: StatusOrdem) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-700';
      case 'em_producao':
        return 'bg-blue-100 text-blue-700';
      case 'pronto':
        return 'bg-green-100 text-green-700';
      case 'retirado':
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: StatusOrdem) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_producao':
        return 'Em Produção';
      case 'pronto':
        return 'Pronto';
      case 'retirado':
        return 'Retirado';
    }
  };

  const filteredOrdens = ordens.filter(o => filterStatus === 'all' || o.status === filterStatus);

  const selectedOrdem = selectedOrdemForWhatsApp ? ordens.find(o => o.id === selectedOrdemForWhatsApp) : null;
  const selectedCliente = selectedOrdem ? getClienteById(selectedOrdem.clienteId) : null;
  const selectedProduto = selectedOrdem ? getProdutoById(selectedOrdem.produtoId) : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentScreen('dashboard')} className="p-2 hover:bg-blue-700 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1>Ordens de Serviço</h1>
            <p className="text-blue-100 mt-1">{ordens.filter(o => o.status !== 'retirado').length} aberta(s)</p>
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
                  onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} - {cliente.telefone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Chave Original (Código/Referência) *</label>
                <input
                  type="text"
                  value={formData.chaveOriginal}
                  onChange={(e) => setFormData({ ...formData, chaveOriginal: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: YL-1234"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Tipo de Matriz *</label>
                <select
                  value={formData.produtoId}
                  onChange={(e) => setFormData({ ...formData, produtoId: e.target.value })}
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
                      {produto.nome} ({produto.codigo}) - Estoque: {produto.quantidadeEstoque}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Status Inicial *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusOrdem })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pendente">Pendente</option>
                  <option value="em_producao">Em Produção</option>
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
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterStatus('pendente')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  filterStatus === 'pendente' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700 border'
                }`}
              >
                Pendente
              </button>
              <button
                onClick={() => setFilterStatus('em_producao')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  filterStatus === 'em_producao' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'
                }`}
              >
                Em Produção
              </button>
              <button
                onClick={() => setFilterStatus('pronto')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  filterStatus === 'pronto' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border'
                }`}
              >
                Pronto
              </button>
              <button
                onClick={() => setFilterStatus('retirado')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  filterStatus === 'retirado' ? 'bg-gray-600 text-white' : 'bg-white text-gray-700 border'
                }`}
              >
                Retirado
              </button>
            </div>
          </div>
        )}

        {/* Lista de Ordens */}
        {!showForm && (
          <div className="space-y-3">
            {filteredOrdens.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {filterStatus === 'all' ? 'Nenhuma ordem cadastrada' : 'Nenhuma ordem com este status'}
              </div>
            ) : (
              filteredOrdens
                .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
                .map((ordem) => {
                  const cliente = getClienteById(ordem.clienteId);
                  const produto = getProdutoById(ordem.produtoId);
                  
                  return (
                    <div key={ordem.id} className="bg-white rounded-lg p-4 shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-gray-800">{cliente?.nome || 'Cliente não encontrado'}</p>
                          <p className="text-gray-600 mt-1">
                            {produto?.nome || 'Produto não encontrado'} - Ref: {ordem.chaveOriginal}
                          </p>
                          <p className="text-gray-500">
                            {new Date(ordem.dataCriacao).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full ${getStatusColor(ordem.status)}`}>
                          {getStatusLabel(ordem.status)}
                        </span>
                      </div>

                      {ordem.status !== 'retirado' && (
                        <div className="space-y-2">
                          <label className="block text-gray-700">Atualizar Status:</label>
                          <select
                            value={ordem.status}
                            onChange={(e) => handleStatusChange(ordem.id, e.target.value as StatusOrdem)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="pendente">Pendente</option>
                            <option value="em_producao">Em Produção</option>
                            <option value="pronto">Pronto para Retirada</option>
                          </select>

                          <div className="flex gap-2">
                            {ordem.status === 'pronto' && (
                              <>
                                <button
                                  onClick={() => handleWhatsAppSend(ordem.id)}
                                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                                >
                                  <MessageCircle className="w-5 h-5" />
                                  Enviar WhatsApp
                                </button>
                                <button
                                  onClick={() => handlePrepareRetirada(ordem.id)}
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
      </div>

      {/* WhatsApp Modal */}
      {selectedCliente && selectedProduto && (
        <WhatsAppModal
          isOpen={showWhatsAppModal}
          onClose={handleWhatsAppModalClose}
          onSend={handleWhatsAppModalClose}
          cliente={selectedCliente}
          produtoNome={selectedProduto.nome}
        />
      )}
    </div>
  );
}
