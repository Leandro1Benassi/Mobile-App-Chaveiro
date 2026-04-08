import { Users, Package, Wrench, ClipboardList, ShoppingCart, LogOut, AlertTriangle, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

export function Dashboard() {
  const { currentUser, logout, setCurrentScreen, ordens, produtos, clientes, vendas } = useApp();

  const ordensAbertas = ordens.filter(o => o.status !== 'retirado').length;
  const ordensProntas = ordens.filter(o => o.status === 'pronto').length;
  const produtosBaixoEstoque = produtos.filter(p => p.quantidadeEstoque <= p.estoqueMinimo).length;
  const vendasHoje = vendas.filter(v => {
    const hoje = new Date().toDateString();
    const dataVenda = new Date(v.data).toDateString();
    return hoje === dataVenda;
  }).length;

  const totalVendasHoje = vendas
    .filter(v => {
      const hoje = new Date().toDateString();
      const dataVenda = new Date(v.data).toDateString();
      return hoje === dataVenda;
    })
    .reduce((sum, v) => sum + v.valor, 0);

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Logo />
            <p className="text-blue-100 mt-1">Olá, {currentUser?.nome}</p>
            <span className="inline-block mt-1 px-2 py-1 bg-blue-700 rounded text-blue-100">
              {currentUser?.role === 'admin' ? 'Administrador' : 'Operador'}
            </span>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Alertas */}
        {produtosBaixoEstoque > 0 && (
          <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-orange-800">
                <strong>Atenção!</strong> {produtosBaixoEstoque} produto(s) com estoque baixo
              </p>
            </div>
          </div>
        )}

        {ordensProntas > 0 && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-800">
                <strong>{ordensProntas}</strong> pedido(s) pronto(s) para retirada
              </p>
            </div>
          </div>
        )}

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-gray-600 mb-1">Pedidos Abertos</p>
            <p className="text-blue-600">{ordensAbertas}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-gray-600 mb-1">Vendas Hoje</p>
            <p className="text-green-600">{vendasHoje}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-gray-600 mb-1">Clientes</p>
            <p className="text-purple-600">{clientes.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-gray-600 mb-1">Faturamento Hoje</p>
            <p className="text-green-600">
              R$ {totalVendasHoje.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Mini Catálogo de Produtos */}
        {produtos.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-gray-700">🔑 Nossos Produtos</h2>
              {isAdmin && (
                <button
                  onClick={() => setCurrentScreen('produtos')}
                  className="text-orange-600 hover:text-orange-700"
                >
                  Ver todos
                </button>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
              {produtos.slice(0, 5).map((produto) => (
                <div
                  key={produto.id}
                  className="flex-shrink-0 w-32 bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="relative h-24 bg-gradient-to-br from-gray-100 to-gray-200">
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
                    <div className="absolute top-1 right-1">
                      <span className={`px-2 py-0.5 rounded-full text-white text-xs shadow-lg ${
                        produto.quantidadeEstoque <= produto.estoqueMinimo
                          ? 'bg-red-500'
                          : 'bg-green-500'
                      }`}>
                        {produto.quantidadeEstoque}
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-gray-800 text-xs truncate">{produto.nome}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{produto.codigo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Principal */}
        <div className="space-y-3">
          <h2 className="text-gray-700 mb-3">Menu Principal</h2>

          <button
            onClick={() => setCurrentScreen('copiaChave')}
            className="w-full bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="bg-blue-100 p-3 rounded-lg">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-800">Ordens de Serviço</p>
              <p className="text-gray-500">Gerenciar cópias de chaves</p>
            </div>
          </button>

          <button
            onClick={() => setCurrentScreen('vendaDireta')}
            className="w-full bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="bg-green-100 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-800">Venda Direta</p>
              <p className="text-gray-500">Registrar vendas rápidas</p>
            </div>
          </button>

          {isAdmin && (
            <>
              <h2 className="text-gray-700 mb-3 mt-6">Cadastros (Admin)</h2>

              <button
                onClick={() => setCurrentScreen('clientes')}
                className="w-full bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow flex items-center gap-4"
              >
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-800">Clientes</p>
                  <p className="text-gray-500">Gerenciar cadastro de clientes</p>
                </div>
              </button>

              <button
                onClick={() => setCurrentScreen('produtos')}
                className="w-full bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow flex items-center gap-4"
              >
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-800">Produtos (Matrizes)</p>
                  <p className="text-gray-500">Controlar estoque de chaves</p>
                </div>
              </button>

              <button
                onClick={() => setCurrentScreen('servicos')}
                className="w-full bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow flex items-center gap-4"
              >
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Wrench className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-800">Serviços</p>
                  <p className="text-gray-500">Cadastro de serviços</p>
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}