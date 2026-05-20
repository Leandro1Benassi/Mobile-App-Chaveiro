import { useState } from "react";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Logo } from "./Logo";

export function RecuperarSenha() {
  const { setCurrentScreen } = useApp();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    window.setTimeout(() => {
      setLoading(false);
      setMessage("Se o email estiver cadastrado, enviaremos as instrucoes de recuperacao.");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <button
            type="button"
            onClick={() => setCurrentScreen("login")}
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para login
          </button>

          <div className="flex flex-col items-center mb-8">
            <Logo size="large" variant="dark" />
            <h1 className="mt-6 text-gray-900">Recuperar senha</h1>
            <p className="text-gray-600 text-center mt-2">
              Informe seu email para receber as instrucoes de acesso.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <label htmlFor="recuperar-email" className="block text-gray-700">
              Email
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="recuperar-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (message) setMessage("");
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="seu@email.com"
                  required
                  disabled={loading}
                />
              </div>
            </label>

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar instrucoes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
