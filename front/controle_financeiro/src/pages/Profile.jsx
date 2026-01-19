import { User, Save, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function Profile({
  currentUser,
  users,
  setUsers,
  setCurrentUser,
  setPage
}) {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);

  function handleSave(e) {
    e.preventDefault();

    const updatedUser = { ...currentUser, name, email };

    const updatedUsers = users.map(user =>
      user.id === currentUser.id ? updatedUser : user
    );

    setUsers(updatedUsers);
    setCurrentUser(updatedUser);
    setPage('devotionals');
  }

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-6">
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <User className="text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">
            Meu Perfil
          </h2>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-slate-300 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => setPage('devotionals')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition"
            >
              <ArrowLeft size={18} />
              Voltar
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition"
            >
              <Save size={18} />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
