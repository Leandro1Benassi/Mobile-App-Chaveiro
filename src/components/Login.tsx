import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Logo } from "./Logo";
import { GoogleLogin } from "@react-oauth/google";

export function Login() {
  const { login, loginWithGoogle, setCurrentScreen } = useApp();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const token = credentialResponse?.credential;

      if (!token) return;

      const success = await loginWithGoogle(token);

      if (!success) {
        setError("Falha no login Google");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const sucesso = await login(email, senha);

      if (sucesso) {
        setCurrentScreen("dashboard");
      } else {
        setError("Email ou senha incorretos");
      }
    } catch (error) {
      setError("Email ou senha incorretos");
      console.log(error);
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
            <p className="text-gray-600 text-center mt-4">
              Sistema de Gestão de Chaveiro
            </p>
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
                disabled={loading}
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
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-500">ou</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Erro Google")}
          />

          <div className="mt-4 flex flex-col items-center gap-3 text-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentScreen("recuperarSenha");
              }}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
            >
              Esqueceu sua senha?
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentScreen("cadastro");
              }}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
            >
              Não tem conta? Cadastre-se
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
