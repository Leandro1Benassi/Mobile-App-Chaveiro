import { useState, useRef } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SignatureCanvas from 'react-signature-canvas';

export function VendaDireta() {
  const { setCurrentScreen, clientes, addVenda } = useApp();
  const [clienteId, setClienteId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [showRecibo, setShowRecibo] = useState(false);
  const [lastVenda, setLastVenda] = useState<any>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);

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

    const venda = {
      clienteId: clienteId || undefined,
      descricao,
      valor: parseFloat(valor),
      formaPagamento,
      assinatura,
    };

    addVenda(venda);
    setLastVenda({
      ...venda,
      cliente: clienteId ? clientes.find(c => c.id === clienteId) : null,
      data: new Date(),
    });
    setShowRecibo(true);
  };

  const handleFinish = () => {
    setClienteId('');
    setDescricao('');
    setValor('');
    setFormaPagamento('');
    setShowRecibo(false);
    setLastVenda(null);
    sigCanvas.current?.clear();
  };

  if (showRecibo && lastVenda) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-green-600 text-white p-4 shadow-lg">
          <h1 className="text-center">Recibo de Venda</h1>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-gray-800 mb-2">Venda Registrada com Sucesso!</h2>
            </div>

            <div className="space-y-3 mb-6">
              {lastVenda.cliente && (
                <>
                  <div className="border-b pb-2">
                    <p className="text-gray-600">Cliente:</p>
                    <p className="text-gray-800">{lastVenda.cliente.nome}</p>
                  </div>

                  <div className="border-b pb-2">
                    <p className="text-gray-600">Telefone:</p>
                    <p className="text-gray-800">{lastVenda.cliente.telefone}</p>
                  </div>
                </>
              )}

              <div className="border-b pb-2">
                <p className="text-gray-600">Descrição:</p>
                <p className="text-gray-800">{lastVenda.descricao}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-600">Valor Pago:</p>
                <p className="text-green-600">R$ {lastVenda.valor.toFixed(2)}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-600">Forma de Pagamento:</p>
                <p className="text-gray-800">{lastVenda.formaPagamento}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-gray-600">Data:</p>
                <p className="text-gray-800">
                  {lastVenda.data.toLocaleDateString('pt-BR')} às {lastVenda.data.toLocaleTimeString('pt-BR')}
                </p>
              </div>

              {lastVenda.assinatura && (
                <div>
                  <p className="text-gray-600 mb-2">Assinatura do Cliente:</p>
                  <div className="border rounded-lg p-2 bg-gray-50">
                    <img src={lastVenda.assinatura} alt="Assinatura" className="w-full" />
                  </div>
                </div>
              )}
            </div>

            <div className="text-center text-gray-500 mb-6">
              <p>Chaves Alves</p>
              <p>Obrigado pela preferência!</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleFinish}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
              >
                Nova Venda
              </button>
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentScreen('dashboard')} className="p-2 hover:bg-green-700 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1>Venda Direta</h1>
        </div>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-gray-800 mb-4">Informações da Venda</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Cliente (Opcional)</label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Sem cliente vinculado</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} - {cliente.telefone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Descrição do Serviço/Produto *</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Ex: Venda de cadeado, Reparo rápido..."
                  required
                />
              </div>

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
            Registrar Venda
          </button>
        </form>
      </div>
    </div>
  );
}
