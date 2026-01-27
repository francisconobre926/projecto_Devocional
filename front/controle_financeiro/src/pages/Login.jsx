
import { useState } from "react";
import { User, Lock } from "lucide-react";
import api from "../services/api";
import toast from "../lib/Toast";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login({ setIsAuthenticated, darkMode }) {
  const [loginForm, setLoginForm] = useState({ email: "", senha: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // rota de retorno (quando foi redirecionado pelo ProtectedLayout)
  const from = location.state?.from || "/home";

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.senha) {
      toast.warning("Preencha todos os campos!");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(
        "/auth/login",
        { email: loginForm.email, senha: loginForm.senha },
        { skipAuth: true }
      );

      const { token, usuario } = response.data.body || {};

      if (!token) {
        toast.error("Login falhou. Verifique email e senha.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem(
        "usuario",
        JSON.stringify(usuario || { email: loginForm.email })
      );

      // 🔑 importante: setar o header do axios também
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // atualiza estado do App
      setIsAuthenticated(true);

      // 🔥 importante: avisa o app todo (Header/ProtectedLayout) que mudou auth
      window.dispatchEvent(new Event("auth:changed"));

      toast.success("Login realizado com sucesso!");

      // ✅ volta para a rota que o usuário queria
      navigate(from, { replace: true });

    } catch (error) {
      console.error("Erro no login:", error);

      if (error.response) {
        if (error.response.status === 403) {
          toast.error("Email ou senha incorretos.");
        } else {
          toast.error("Erro ao conectar com o servidor.");
        }
      } else {
        toast.error("Erro de rede. Verifique sua conexão.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen 
      ${darkMode ? "bg-slate-900" : "bg-gradient-to-r from-indigo-100 to-blue-100"} px-4`}
    >
      <div
        className={`w-full max-w-md p-10 rounded-3xl
        ${
          darkMode
            ? "bg-slate-900/90 shadow-2xl border border-slate-700"
            : "bg-white shadow-2xl border border-gray-200"
        } 
        backdrop-blur-sm`}
      >
        <h2
          className={`text-4xl font-extrabold mb-6 text-center 
          ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          Bem-vindo de volta
        </h2>

        <p className={`text-center mb-8 ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
          Faça login para continuar sua jornada espiritual
        </p>

        <div className="relative mb-4">
          <User className={`absolute left-3 top-3.5 ${darkMode ? "text-slate-400" : "text-gray-400"}`} />
          <input
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2
              ${
                darkMode
                  ? "bg-slate-800 text-white placeholder-slate-400 focus:ring-indigo-500"
                  : "bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-300 focus:ring-indigo-500"
              } transition`}
          />
        </div>

        <div className="relative mb-6">
          <Lock className={`absolute left-3 top-3.5 ${darkMode ? "text-slate-400" : "text-gray-400"}`} />
          <input
            type="password"
            placeholder="Senha"
            value={loginForm.senha}
            onChange={(e) => setLoginForm({ ...loginForm, senha: e.target.value })}
            className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2
              ${
                darkMode
                  ? "bg-slate-800 text-white placeholder-slate-400 focus:ring-indigo-500"
                  : "bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-300 focus:ring-indigo-500"
              } transition`}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-lg transition-all
            ${
              darkMode
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg"
            }`}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/auth/register")}
            className={`font-medium transition ${
              darkMode ? "text-cyan-400 hover:text-cyan-300" : "text-indigo-600 hover:text-indigo-500"
            }`}
          >
            Não tem conta? Criar agora
          </button>
        </div>
      </div>
    </div>
  );
}
