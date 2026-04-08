import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useApp } from '../context/AppContext'; 
import { Logo } from './Logo'; 

// Renomeando a função para seguir o padrão do arquivo (CadastroUser.tsx)
export function CadastroUser() { 
  // Destruturado 'cadastro' e 'setCurrentScreen' para navegação
  const { cadastro, setCurrentScreen } = useApp(); 
  
  // Estados corrigidos
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState(''); // Estado de senha corrigido
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Chama a função cadastro do contexto (que também loga e navega para dashboard em caso de sucesso)
      const sucesso = cadastro({ nome, email }, senha); 
      
      if (sucesso) {
        // Se a função cadastro foi bem-sucedida, o AppContext já navegou para 'dashboard'.
        console.log('Cadastro bem-sucedido! Redirecionamento automático via AppContext.');
        // Não precisamos de setCurrentScreen aqui, pois o contexto faz o trabalho.
      } else {
        // Se for false, significa que o email já existia ou houve erro interno.
        setError('Erro ao cadastrar. Verifique se o email já está em uso.');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado no servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <Logo size="large" variant="dark" />
            <h1 className="text-2xl font-bold text-gray-800 mt-4">Criar Nova Conta</h1>
            <p className="text-gray-600 text-center text-sm mt-1">Sistema de Gestão de Chaveiro</p>
          </div>

          <form onSubmit={handleCadastro} className="space-y-4">
            
            {/* Campo Nome Completo */}
            <div>
              <label htmlFor="nome" className="block text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Seu nome"
                required
                disabled={loading}
              />
            </div>
            
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="senha" className="block text-gray-700 mb-2">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          {/* Link para Login (Navegação de Retorno) */}
          <div className="mt-6 text-center">
            <a 
              href="#"
              // IMPLEMENTAÇÃO DA NAVEGAÇÃO DE VOLTA
              onClick={(e) => {
                e.preventDefault();
                setCurrentScreen('login'); // <--- MUDANÇA DE TELA
              }}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
            >
              Já tem conta? Fazer Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}