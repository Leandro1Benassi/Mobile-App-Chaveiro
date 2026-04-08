import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

export function Login() {
  // 1. IMPORTAÇÃO: Destruturar setCurrentScreen do contexto
  const { login, setCurrentScreen } = useApp();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState(''); // CORRIGIDO: Adicionado nome da variável
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(email, senha)) {
      // Login bem-sucedido (o AppContext já muda a tela para 'dashboard')
    } else {
      setError('Email ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <Logo size="large" variant="dark" />
            <p className="text-gray-600 text-center mt-4">Sistema de Gestão de Chaveiro</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
              />
            </div>

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
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Entrar
            </button>
          </form>
          
          {/* 2. NOVO LINK PARA CADASTRO */}
          <div className="mt-4 text-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentScreen('cadastro'); // Mudar o estado global para 'cadastro'
              }}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
            >
              Não tem conta? Cadastre-se
            </a>
          </div>
          {/* FIM NOVO LINK */}

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-center mb-2">Credenciais de teste:</p>
            <p className="text-gray-700 text-center"><strong>Admin:</strong> admin@chavesalves.com</p>
            <p className="text-gray-700 text-center"><strong>Operador:</strong> operador@chavesalves.com</p>
            <p className="text-gray-700 text-center mt-2"><strong>Senha:</strong> senha123</p>
          </div>
        </div>
      </div>
    </div>
  );
}