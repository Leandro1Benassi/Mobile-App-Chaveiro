import { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function CadastroClientes() {
  const { setCurrentScreen, clientes, addCliente, updateCliente, deleteCliente } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    cpf: '',
    email: '',
    endereco: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCliente(editingId, formData);
    } else {
      addCliente(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ nome: '', telefone: '', cpf: '', email: '', endereco: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    const cliente = clientes.find(c => c.id === id);
    if (cliente) {
      setFormData({
        nome: cliente.nome,
        telefone: cliente.telefone,
        cpf: cliente.cpf || '',
        email: cliente.email || '',
        endereco: cliente.endereco || '',
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteCliente(id);
    }
  };

  const filteredClientes = clientes.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentScreen('dashboard')} className="p-2 hover:bg-purple-700 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1>Clientes</h1>
            <p className="text-purple-100 mt-1">{clientes.length} cadastrado(s)</p>
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
              {editingId ? 'Editar Cliente' : 'Novo Cliente'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nome Completo *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Telefone (WhatsApp) *</label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="(11) 98765-4321"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">CPF</label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="cliente@email.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Endereço</label>
                <textarea
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                >
                  {editingId ? 'Atualizar' : 'Cadastrar'}
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
                {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </div>
            ) : (
              filteredClientes.map((cliente) => (
                <div key={cliente.id} className="bg-white rounded-lg p-4 shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-gray-800">{cliente.nome}</p>
                      <p className="text-gray-600 mt-1">{cliente.telefone}</p>
                      {cliente.email && (
                        <p className="text-gray-500 mt-1">{cliente.email}</p>
                      )}
                      {cliente.cpf && (
                        <p className="text-gray-500">CPF: {cliente.cpf}</p>
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
