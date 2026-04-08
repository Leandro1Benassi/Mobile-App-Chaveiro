import { X, MessageCircle, Send } from 'lucide-react';
import { Cliente } from '../context/AppContext';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: () => void;
  cliente: Cliente;
  produtoNome?: string;
}

export function WhatsAppModal({ isOpen, onClose, onSend, cliente, produtoNome }: WhatsAppModalProps) {
  if (!isOpen) return null;

  const mensagemPadrao = `Olá ${cliente.nome}! 👋\n\nSua chave${produtoNome ? ` (${produtoNome})` : ''} está pronta para retirada na *Chaves Alves*! 🔑\n\nEstamos te esperando!\n\nEndereço: [Seu endereço]\nHorário: [Seu horário de atendimento]`;

  const handleWhatsAppClick = () => {
    // Formatar o telefone removendo caracteres especiais
    const telefone = cliente.telefone.replace(/\D/g, '');
    const mensagemEncoded = encodeURIComponent(mensagemPadrao);
    
    // Abrir WhatsApp em nova aba
    window.open(`https://wa.me/55${telefone}?text=${mensagemEncoded}`, '_blank');
    
    onSend();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6" />
            <h2>Notificar Cliente</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 mb-2">Cliente:</p>
            <p className="text-gray-900">{cliente.nome}</p>
            <p className="text-gray-600">{cliente.telefone}</p>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-2">Mensagem que será enviada:</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-800 whitespace-pre-line">{mensagemPadrao}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <p className="text-yellow-800 text-sm">
              ℹ️ Você será redirecionado para o WhatsApp Web para enviar a mensagem.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleWhatsAppClick}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Abrir WhatsApp
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
