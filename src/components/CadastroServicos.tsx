import { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function CadastroServicos() {
  const { setCurrentScreen, servicos, addServico, updateServico, deleteServico } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    precoBase: 0,
    duracaoEstimada: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateServico(editingId, formData);
    } else {
      addServico(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ nome: '', precoBase: 0, duracaoEstimada: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    const servico = servicos.find(s => s.id === id);
    if (servico) {
      setFormData({
        nome: servico.nome,
        precoBase: servico.precoBase,
        duracaoEstimada: servico.duracaoEstimada,
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      deleteServico(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentScreen('dashboard')} className="p-2 hover:bg-indigo-700 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1>Serviços</h1>
            <p className="text-indigo-100 mt-1">{servicos.length} cadastrado(s)</p>
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
        {/* Formulário */}
        {showForm && (
          <div className="bg-white rounded-lg p-4 shadow mb-4">
            <h2 className="text-gray-800 mb-4">
              {editingId ? 'Editar Serviço' : 'Novo Serviço'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nome do Serviço *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: Cópia Padrão"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Preço Base (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precoBase}
                  onChange={(e) => setFormData({ ...formData, precoBase: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Duração Estimada *</label>
                <input
                  type="text"
                  value={formData.duracaoEstimada}
                  onChange={(e) => setFormData({ ...formData, duracaoEstimada: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: 15 minutos"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
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

        {/* Lista de Serviços */}
        {!showForm && (
          <div className="space-y-3">
            {servicos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum serviço cadastrado
              </div>
            ) : (
              servicos.map((servico) => (
                <div key={servico.id} className="bg-white rounded-lg p-4 shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-gray-800">{servico.nome}</p>
                      <p className="text-green-600 mt-1">
                        R$ {servico.precoBase.toFixed(2)}
                      </p>
                      <p className="text-gray-500 mt-1">
                        Duração: {servico.duracaoEstimada}
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
