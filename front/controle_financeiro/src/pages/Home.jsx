import { Heart, Book, Calendar, Shield } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import DevotionalsList from './DevotionalsList';
import SharedDevotionalsPage from './SharedDevotional';

export default function Home({ darkMode, setPage }) {


  return (

    <div>
      {/* Hero Section */}

      <SharedDevotionalsPage />

      <section
        className={
          darkMode
            ? 'relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20'
            : 'relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-20'
        }
      >
        <div
          className={
            darkMode
              ? "absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"
              : "absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"
          }
        />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div
              className={
                darkMode
                  ? 'inline-flex items-center gap-2 bg-blue-500/10 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-500/20 backdrop-blur-sm'
                  : 'inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-indigo-200'
              }
            >
              <Heart size={16} />
              Transforme sua vida espiritual
            </div>

            <h1
              className={
                darkMode
                  ? 'text-5xl md:text-7xl font-bold text-white mb-6 leading-tight'
                  : 'text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight'
              }
            >
              Seus Momentos de
              <span
                className={
                  darkMode
                    ? 'bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent'
                }
              >
                {' '}
                Reflexão{' '}
              </span>
              em um Só Lugar
            </h1>

            <p
              className={
                darkMode
                  ? 'text-xl text-slate-300 mb-10 leading-relaxed'
                  : 'text-xl text-gray-600 mb-10 leading-relaxed'
              }
            >
              Organize suas reflexões espirituais diárias, crie devocionais
              personalizados e acompanhe sua jornada de fé de forma simples e
              inspiradora.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setPage('register')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-lg rounded-xl hover:from-indigo-700 hover:to-blue-700 transition font-semibold shadow-2xl shadow-indigo-500/30"
              >
                Começar Agora Grátis
              </button>

              <button
                onClick={() => setPage('login')}
                className={
                  darkMode
                    ? 'px-8 py-4 bg-slate-800/50 text-slate-200 text-lg rounded-xl hover:bg-slate-700 transition font-semibold border border-slate-700'
                    : 'px-8 py-4 bg-white text-gray-700 text-lg rounded-xl hover:bg-gray-50 transition font-semibold border-2 border-gray-200'
                }
              >
                Já tenho conta
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Features */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Feature
              icon={<Book />}
              title="Crie Devocionais"
              text="Escreva e organize suas reflexões diárias de forma simples."
            />
            <Feature
              icon={<Calendar />}
              title="Organize por Data"
              text="Mantenha um histórico completo das suas reflexões."
            />
            <Feature
              icon={<Shield />}
              title="Totalmente Privado"
              text="Apenas você tem acesso às suas reflexões espirituais."
            />
          </div>
        </div>
      </section>
    </div>



  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
      <div className="bg-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400">{text}</p>
    </div>
  );
}


