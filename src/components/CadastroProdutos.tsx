import { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, AlertTriangle, Image as ImageIcon, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const IMAGENS_SUGERIDAS = [
  'https://images.unsplash.com/photo-1578088085518-738839b57548?w=400',
  'https://images.unsplash.com/photo-1631164159408-540fe1e32537?w=400',
  'https://images.unsplash.com/photo-1665574220508-c065bf90c738?w=400',
  'https://images.unsplash.com/photo-1667857399223-593f0b4e0961?w=400',
  'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400',
  'https://images.unsplash.com/photo-1615092296061-e2ccfeb2f3d6?w=400',
];

export function CadastroProdutos() {
  const { setCurrentScreen, produtos, addProduto, updateProduto, deleteProduto } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    quantidadeEstoque: 0,
    estoqueMinimo: 10,
    imagemUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduto(editingId, formData);
    } else {
      addProduto(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ nome: '', codigo: '', quantidadeEstoque: 0, estoqueMinimo: 10, imagemUrl: '' });
    setShowForm(false);
    setEditingId(null);
    setShowImagePicker(false);
  };

  const handleEdit = (id: string) => {
    const produto = produtos.find(p => p.id === id);
    if (produto) {
      setFormData({
        nome: produto.nome,
        codigo: produto.codigo,
        quantidadeEstoque: produto.quantidadeEstoque,
        estoqueMinimo: produto.estoqueMinimo,
        imagemUrl: produto.imagemUrl || '',
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduto(id);
    }
  };

  const selectImage = (url: string) => {
    setFormData({ ...formData, imagemUrl: url });
    setShowImagePicker(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-4 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setCurrentScreen('dashboard')} className="p-2 hover:bg-orange-700 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1>Catálogo de Produtos</h1>
            <p className="text-orange-100 mt-1">{produtos.length} tipo(s) de chave</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="p-2 bg-orange-700 hover:bg-orange-800 rounded-lg transition-colors shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </button>
          )}
        </div>
        
        {/* Toggle View Mode */}
        {!showForm && (
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-orange-600' 
                  : 'bg-orange-700 text-white hover:bg-orange-800'
              }`}
            >
              Grade
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-orange-600' 
                  : 'bg-orange-700 text-white hover:bg-orange-800'
              }`}
            >
              Lista
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Formulário */}
        {showForm && (
          <div className="bg-white rounded-xl p-4 shadow-lg mb-4 border border-orange-100">
            <h2 className="text-gray-800 mb-4">
              {editingId ? '✏️ Editar Produto' : '➕ Novo Produto'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Preview da Imagem */}
              <div>
                <label className="block text-gray-700 mb-2">Foto do Produto</label>
                <div className="relative">
                  {formData.imagemUrl ? (
                    <div className="relative group">
                      <img
                        src={formData.imagemUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imagemUrl: '' })}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowImagePicker(true)}
                      className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-orange-400 hover:bg-orange-50 transition-colors"
                    >
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                      <span className="text-gray-600">Adicionar Foto</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Seletor de Imagens */}
              {showImagePicker && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl p-4 max-w-md w-full max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-800">Escolha uma foto</h3>
                      <button
                        type="button"
                        onClick={() => setShowImagePicker(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {IMAGENS_SUGERIDAS.map((url, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectImage(url)}
                          className="relative group overflow-hidden rounded-lg border-2 border-transparent hover:border-orange-500 transition-all"
                        >
                          <img
                            src={url}
                            alt={`Opção ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                            <Plus className="w-8 h-8 text-white opacity-0 group-hover:opacity-100" />
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-gray-700 mb-2">Ou cole uma URL:</label>
                      <input
                        type="url"
                        placeholder="https://exemplo.com/imagem.jpg"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const url = (e.target as HTMLInputElement).value;
                            if (url) selectImage(url);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-gray-700 mb-2">Nome do Tipo de Chave *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: Yale Simples, Tetra"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Código SKU/Interno *</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: YS-001"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-2">Estoque *</label>
                  <input
                    type="number"
                    value={formData.quantidadeEstoque}
                    onChange={(e) => setFormData({ ...formData, quantidadeEstoque: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Mínimo *</label>
                  <input
                    type="number"
                    value={formData.estoqueMinimo}
                    onChange={(e) => setFormData({ ...formData, estoqueMinimo: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all shadow-md"
                >
                  {editingId ? 'Atualizar' : 'Cadastrar'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista/Grid de Produtos */}
        {!showForm && (
          <div>
            {produtos.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum produto cadastrado</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Cadastrar Primeiro Produto
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* Visualização em Grade */
              <div className="grid grid-cols-2 gap-4">
                {produtos.map((produto) => (
                  <div
                    key={produto.id}
                    className={`bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform ${
                      produto.quantidadeEstoque <= produto.estoqueMinimo ? 'ring-2 ring-orange-400' : ''
                    }`}
                  >
                    {/* Imagem do Produto */}
                    <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200">
                      {produto.imagemUrl ? (
                        <img
                          src={produto.imagemUrl}
                          alt={produto.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      
                      {/* Badge de Estoque */}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-white shadow-lg ${
                          produto.quantidadeEstoque <= produto.estoqueMinimo
                            ? 'bg-red-500'
                            : produto.quantidadeEstoque <= produto.estoqueMinimo * 2
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}>
                          {produto.quantidadeEstoque}
                        </span>
                      </div>
                    </div>

                    {/* Informações */}
                    <div className="p-3">
                      <p className="text-gray-800 line-clamp-1">{produto.nome}</p>
                      <p className="text-gray-500 mt-1">#{produto.codigo}</p>
                      
                      {produto.quantidadeEstoque <= produto.estoqueMinimo && (
                        <div className="flex items-center gap-1 mt-2 text-orange-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-orange-600">Estoque baixo!</span>
                        </div>
                      )}

                      {/* Ações */}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleEdit(produto.id)}
                          className="flex-1 p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(produto.id)}
                          className="flex-1 p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Visualização em Lista */
              <div className="space-y-3">
                {produtos.map((produto) => (
                  <div
                    key={produto.id}
                    className={`bg-white rounded-xl p-4 shadow-md ${
                      produto.quantidadeEstoque <= produto.estoqueMinimo ? 'border-2 border-orange-400' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                        {produto.imagemUrl ? (
                          <img
                            src={produto.imagemUrl}
                            alt={produto.nome}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 truncate">{produto.nome}</p>
                        <p className="text-gray-600 mt-1">Código: {produto.codigo}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-3 py-1 rounded-full ${
                            produto.quantidadeEstoque <= produto.estoqueMinimo
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            Estoque: {produto.quantidadeEstoque}
                          </span>
                          {produto.quantidadeEstoque <= produto.estoqueMinimo && (
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                          )}
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleEdit(produto.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(produto.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
