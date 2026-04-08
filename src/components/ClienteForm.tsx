import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Cliente } from '../context/AppContext'; // Importa a interface Cliente

// Interface para as propriedades do formulário
interface ClienteFormProps {
  // Se for null, estamos criando. Se tiver ID, estamos editando.
  clienteIdParaEditar?: string | null; 
  onClose: () => void; // Função para fechar o formulário/modal
}

export function ClienteForm({ clienteIdParaEditar, onClose }: ClienteFormProps) {
  const { addCliente, updateCliente, getClienteById } = useApp();
  
  // Estados locais do formulário
  const [nome, setNome] = useState('');
  const = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [loading, setLoading] = useState(false);
  
  const isEditing =!!clienteIdParaEditar;

  // Efeito para carregar dados se estiver em modo de edição
  useEffect(() => {
    if (isEditing && clienteIdParaEditar) {
      const clienteExistente = getClienteById(clienteIdParaEditar);
      if (clienteExistente) {
        setNome(clienteExistente.nome);
        setTelefone(clienteExistente.telefone);
        setCpf(clienteExistente.cpf |

| '');
        setEmail(clienteExistente.email |

| '');
        setEndereco(clienteExistente.endereco |

| '');
      }
    }
  },);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const dadosCliente = { nome, telefone, cpf, email, endereco };
    
    if (isEditing && clienteIdParaEditar) {
      // Se estiver editando
      updateCliente(clienteIdParaEditar, dadosCliente);
    } else {
      // Se estiver criando
      addCliente(dadosCliente);
    }
    
    setLoading(false);
    onClose(); // Fecha o formulário após salvar
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-2xl w-full max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {isEditing? 'Editar Cliente' : 'Novo Cliente'}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-red-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Nome */}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
          <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full mt-1 p-2 border border-gray-300 rounded-lg" />
        </div>
        
        {/* Campo Telefone */}
        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone (WhatsApp)</label>
          <input type="tel" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} required className="w-full mt-1 p-2 border border-gray-300 rounded-lg" />
        </div>
        
        {/* Campo CPF */}
        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF (Opcional)</label>
          <input type="text" id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-lg" />
        </div>
        
        {/* Campo Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-lg" />
        </div>
        
        {/* Campo Endereço */}
        <div>
          <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">Endereço</label>
          <input type="text" id="endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-lg" />
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 pt-4">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            disabled={loading}
          >
            <Save className="w-5 h-5" />
            {loading? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}