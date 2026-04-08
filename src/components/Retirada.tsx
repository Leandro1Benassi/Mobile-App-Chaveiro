import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SignatureCanvas from 'react-signature-canvas';

export function Retirada() {
  const { setCurrentScreen, ordens, updateOrdem, getClienteById, getProdutoById } = useApp();
  const [ordemId, setOrdemId] = useState<string | null>(null);
  const [valor, setValor] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [showRecibo, setShowRecibo] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);

  useEffect(() => {
    const storedOrdemId = sessionStorage.getItem('currentOrdemId');
    if (storedOrdemId) {
      setOrdemId(storedOrdemId);
    }
  }, []);

  const ordem = ordemId ? ordens.find(o => o.id === ordemId) : null;
  const cliente = ordem ? getClienteById(ordem.clienteId) : null;
  const produto = ordem ? getProdutoById(ordem.produtoId) : null;

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      alert('Por favor, adicione a assinatura do cliente');
      return;
    }

    const assinatura = sigCanvas.current.toDataURL();

    if (ordem) {
      updateOrdem(ordem.id, {
        status: 'retirado',
        valor: parseFloat(valor),
        formaPagamento,
        assinatura,
      });

      setShowRecibo(true);
    }
  };

  const handleFinish = () => {
    sessionStorage.removeItem('currentOrdemId');
    setCurrentScreen('copiaChave');
  };

  if (!ordem || !cliente || !produto) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-green-600 text-white p-4 shadow-lg">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentScreen('copiaChave')} className="p-2 hover:bg-green-700 rounded-lg">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1>Retirada de Pedido</h1>
          </div>
        </div>
        <div className="p-4 text-center text-gray-600">
          Ordem não encontrada
        </div>
      </div>
    );
  }

  if (showRecibo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-green-600 text-white p-4 shadow-lg">
          <h1 className="text-center">Recibo Digital</h1>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-gray-800 mb-2">Pedido Retirado com Sucesso!</h2>
            </div>

            <div className="space-y-3 mb-6">
              <div className="border-b pb-2">
                <p className="text-gray-600">Cliente:</p>
                <p className="text-gray-800">{cliente.nome}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-600">Telefone:</p>
                <p className="text-gray-800">{cliente.telefone}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-600">Serviço:</p>
                <p className="text-gray-800">Cópia de Chave - {produto.nome}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-600">Referência:</p>
                <p className="text-gray-800">{ordem.chaveOriginal}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-600">Valor Pago:</p>
                <p className="text-green-600">R$ {parseFloat(valor).toFixed(2)}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-600">Forma de Pagamento:</p>
                <p className="text-gray-800">{formaPagamento}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-600">Data:</p>
                <p className="text-gray-800">
                  {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
                </p>
              </div>

              {ordem.assinatura && (
                <div>
                  <p className="text-gray-600 mb-2">Assinatura do Cliente:</p>
                  <div className="border rounded-lg p-2 bg-gray-50">
                    <img src={ordem.assinatura} alt="Assinatura" className="w-full" />
                  </div>
                </div>
              )}
            </div>

            <div className="text-center text-gray-500 mb-6">
              <p>Chaves Alves</p>
              <p>Obrigado pela preferência!</p>
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
            >
              Concluir
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentScreen('copiaChave')} className="p-2 hover:bg-green-700 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1>Retirada de Pedido</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-lg p-4 shadow mb-4">
          <h2 className="text-gray-800 mb-4">Informações do Pedido</h2>
          <div className="space-y-2">
            <p className="text-gray-600">Cliente: <span className="text-gray-800">{cliente.nome}</span></p>
            <p className="text-gray-600">Produto: <span className="text-gray-800">{produto.nome}</span></p>
            <p className="text-gray-600">Referência: <span className="text-gray-800">{ordem.chaveOriginal}</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-gray-800 mb-4">Pagamento</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Valor Total (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Forma de Pagamento *</label>
                <select
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="PIX">PIX</option>
                  <option value="Crédito">Crédito</option>
                  <option value="Débito">Débito</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-gray-800 mb-4">Assinatura do Cliente *</h2>
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-2">
              <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{
                  className: 'w-full h-40 bg-white',
                }}
              />
            </div>
            <button
              type="button"
              onClick={clearSignature}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
            >
              Limpar Assinatura
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
          >
            Confirmar Retirada
          </button>
        </form>
      </div>
    </div>
  );
}
