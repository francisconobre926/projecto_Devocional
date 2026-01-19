// import { useState } from 'react';
// import { User, Mail, Lock } from 'lucide-react';

// export default function Register({ users, setUsers, setCurrentUser, setPage, darkMode }) {
//   const [registerForm, setRegisterForm] = useState({
//     nome: '',
//     email: '',
//     senha: '',
//   });

//   const handleRegister = () => {
//     if (!registerForm.nome || !registerForm.email || !registerForm.senha) {
//       return alert('Preencha todos os campos');
//     }

//     if (users.find(u => u.email === registerForm.email)) {
//       return alert('Email já registrado');
//     }

//     const newUser = { ...registerForm };
//     setUsers([...users, newUser]);
//     setCurrentUser(newUser);
//     setPage('devotionals');
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r 
//                     from-indigo-100 to-blue-100 dark:from-slate-900 dark:to-slate-800 px-4">
//       <div className={`w-full max-w-md p-10 rounded-3xl 
//                        ${darkMode
//           ? 'bg-slate-900/90 shadow-2xl border border-slate-700'
//           : 'bg-white shadow-2xl border border-gray-200'} 
//                        backdrop-blur-sm`}
//       >
//         {/* Título */}
//         <h2 className={`text-4xl font-extrabold mb-6 text-center 
//                         ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//           Criar Conta
//         </h2>
//         <p className={`text-center mb-8 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
//           Comece sua jornada espiritual gratuitamente
//         </p>

//         {/* Input Nome */}
//         <div className="relative mb-4">
//           <User className={`absolute left-3 top-3.5 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`} />
//           <input
//             type="text"
//             placeholder="Nome"
//             value={registerForm.nome}
//             onChange={e => setRegisterForm({ ...registerForm, nome: e.target.value })}
//             className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 
//                         ${darkMode
//                 ? 'bg-slate-800 text-white placeholder-slate-400 focus:ring-indigo-500'
//                 : 'bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-300 focus:ring-indigo-500'
//               } transition`}
//           />
//         </div>

//         {/* Input Email */}
//         <div className="relative mb-4">
//           <Mail className={`absolute left-3 top-3.5 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`} />
//           <input
//             type="email"
//             placeholder="Email"
//             value={registerForm.email}
//             onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
//             className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 
//                         ${darkMode
//                 ? 'bg-slate-800 text-white placeholder-slate-400 focus:ring-indigo-500'
//                 : 'bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-300 focus:ring-indigo-500'
//               } transition`}
//           />
//         </div>

//         {/* Input Senha */}
//         <div className="relative mb-6">
//           <Lock className={`absolute left-3 top-3.5 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`} />
//           <input
//             type="password"
//             placeholder="Senha"
//             value={registerForm.senha}
//             onChange={e => setRegisterForm({ ...registerForm, senha: e.target.value })}
//             className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 
//                         ${darkMode
//                 ? 'bg-slate-800 text-white placeholder-slate-400 focus:ring-indigo-500'
//                 : 'bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-300 focus:ring-indigo-500'
//               } transition`}
//           />
//         </div>

//         {/* Botão Criar Conta */}
//         <button
//           onClick={handleRegister}
//           className={`w-full py-3 rounded-xl font-semibold text-lg transition-all
//                       ${darkMode
//               ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
//               : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg'}
//                     `}
//         >
//           Criar Conta
//         </button>

//         {/* Link para Login */}
//         <div className="mt-6 text-center">
//           <button
//             onClick={() => setPage('login')}
//             className={`font-medium transition ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-indigo-600 hover:text-indigo-500'}`}
//           >
//             Já tem conta? Entrar
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




import { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from '../lib/Toast';

export default function Register({ setIsAuthenticated, darkMode }) {
  const [registerForm, setRegisterForm] = useState({
    nome: '',
    email: '',
    senha: '',
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // se veio de uma rota protegida
  const from = location.state?.from || '/home';

  const handleRegister = async () => {
    if (!registerForm.nome || !registerForm.email || !registerForm.senha) {
      toast.warning('Preencha todos os campos!');
      return;
    }

    setLoading(true);
    try {
      // cadastra no backend
      const res = await api.post(
        '/auth/cadastrar',
        {
          nome: registerForm.nome,
          email: registerForm.email,
          senha: registerForm.senha,
        },
        { skipAuth: true }
      );

      // ✅ se seu backend já devolve token/usuario, aproveita e loga automaticamente
      const { token, usuario } = res.data.body || {};

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem(
          'usuario',
          JSON.stringify(usuario || { email: registerForm.email, nome: registerForm.nome })
        );

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated?.(true);
        window.dispatchEvent(new Event('auth:changed'));

        toast.success('Conta criada e login realizado!');
        navigate(from, { replace: true });
        return;
      }

      // ✅ se o backend NÃO devolve token, apenas confirma e manda para login
      toast.success('Conta criada com sucesso! Faça login.');
      navigate('/auth/login', { replace: true, state: { from } });

    } catch (error) {
      console.error('Erro no cadastro:', error);

      if (error.response) {
        // ajuste conforme tua API
        if (error.response.status === 409) {
          toast.error('Email já registrado.');
        } else if (error.response.status === 400) {
          toast.error('Dados inválidos. Verifique os campos.');
        } else {
          toast.error('Erro ao conectar com o servidor.');
        }
      } else {
        toast.error('Erro de rede. Verifique sua conexão.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r 
                    from-indigo-100 to-blue-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div
        className={`w-full max-w-md p-10 rounded-3xl 
        ${darkMode
            ? 'bg-slate-900/90 shadow-2xl border border-slate-700'
            : 'bg-white shadow-2xl border border-gray-200'} 
        backdrop-blur-sm`}
      >
        <h2 className={`text-4xl font-extrabold mb-6 text-center 
                        ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Criar Conta
        </h2>

        <p className={`text-center mb-8 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          Comece sua jornada espiritual gratuitamente
        </p>

        <div className="relative mb-4">
          <User className={`absolute left-3 top-3.5 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Nome"
            value={registerForm.nome}
            onChange={e => setRegisterForm({ ...registerForm, nome: e.target.value })}
            className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 
              ${darkMode
                ? 'bg-slate-800 text-white placeholder-slate-400 focus:ring-indigo-500'
                : 'bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-300 focus:ring-indigo-500'
              } transition`}
          />
        </div>

        <div className="relative mb-4">
          <Mail className={`absolute left-3 top-3.5 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`} />
          <input
            type="email"
            placeholder="Email"
            value={registerForm.email}
            onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
            className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 
              ${darkMode
                ? 'bg-slate-800 text-white placeholder-slate-400 focus:ring-indigo-500'
                : 'bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-300 focus:ring-indigo-500'
              } transition`}
          />
        </div>

        <div className="relative mb-6">
          <Lock className={`absolute left-3 top-3.5 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`} />
          <input
            type="password"
            placeholder="Senha"
            value={registerForm.senha}
            onChange={e => setRegisterForm({ ...registerForm, senha: e.target.value })}
            className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 
              ${darkMode
                ? 'bg-slate-800 text-white placeholder-slate-400 focus:ring-indigo-500'
                : 'bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-300 focus:ring-indigo-500'
              } transition`}
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-lg transition-all
            ${darkMode
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
              : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg'}
          `}
        >
          {loading ? 'Criando...' : 'Criar Conta'}
        </button>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/auth/login', { state: { from } })}
            className={`font-medium transition ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-indigo-600 hover:text-indigo-500'}`}
          >
            Já tem conta? Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
