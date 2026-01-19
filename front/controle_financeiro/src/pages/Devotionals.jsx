import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, Heart, User, Globe, Lock, Plus } from 'lucide-react';

export default function DevotionalsList() {
  const [liked, setLiked] = useState({});
  const [devotionals, setDevotionals] = useState([]);
  const [currentUser] = useState("João Silva");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDevotional, setNewDevotional] = useState({
    title: '',
    verse: '',
    excerpt: '',
    category: 'Fé',
    duration: '5 min'
  });

  useEffect(() => {
    loadDevotionals();
  }, []);

  const loadDevotionals = async () => {
    try {
      const sharedResult = await window.storage.list('devotional:shared:', true);
      const privateResult = await window.storage.list('devotional:private:', false);
      
      const sharedDevotionals = sharedResult && sharedResult.keys ? await Promise.all(
        sharedResult.keys.map(async (key) => {
          try {
            const data = await window.storage.get(key, true);
            return data ? { ...JSON.parse(data.value), isShared: true } : null;
          } catch (error) {
            return null;
          }
        })
      ) : [];

      const privateDevotionals = privateResult && privateResult.keys ? await Promise.all(
        privateResult.keys.map(async (key) => {
          try {
            const data = await window.storage.get(key, false);
            return data ? { ...JSON.parse(data.value), isShared: false } : null;
          } catch (error) {
            return null;
          }
        })
      ) : [];

      const allDevotionals = [...sharedDevotionals, ...privateDevotionals].filter(d => d !== null);
      
      if (allDevotionals.length === 0) {
        setDevotionals(getDefaultDevotionals());
      } else {
        setDevotionals(allDevotionals);
      }
    } catch (error) {
      console.log('Carregando devocionais padrão');
      setDevotionals(getDefaultDevotionals());
    }
  };

  const getDefaultDevotionals = () => [
    {
      id: 1,
      title: "Confiança em Tempos Difíceis",
      verse: "Salmos 23:4",
      date: "08 Jan 2026",
      duration: "5 min",
      excerpt: "Mesmo quando andamos no vale da sombra da morte, não devemos temer, pois Deus está conosco. Esta promessa nos lembra que em cada desafio, em cada momento de incerteza, não estamos sozinhos.",
      category: "Fé",
      author: "Maria Santos",
      isShared: true
    },
    {
      id: 2,
      title: "O Amor que Transforma",
      verse: "1 Coríntios 13:4-7",
      date: "07 Jan 2026",
      duration: "7 min",
      excerpt: "O amor é paciente, o amor é bondoso. Descubra como o amor de Deus pode transformar sua vida e seus relacionamentos de maneira profunda e duradoura.",
      category: "Amor",
      author: "Pedro Oliveira",
      isShared: false
    },
    {
      id: 3,
      title: "Força para Recomeçar",
      verse: "Isaías 40:31",
      date: "06 Jan 2026",
      duration: "6 min",
      excerpt: "Os que esperam no Senhor renovam suas forças. Aprenda a encontrar força em Deus para novos começos, mesmo quando tudo parece impossível.",
      category: "Esperança",
      author: "Ana Costa",
      isShared: true
    },
    {
      id: 4,
      title: "Paz em Meio à Tempestade",
      verse: "João 14:27",
      date: "05 Jan 2026",
      duration: "5 min",
      excerpt: "Jesus nos deixa sua paz, uma paz que o mundo não pode dar. Encontre descanso em meio às adversidades e descubra a verdadeira tranquilidade.",
      category: "Paz",
      author: currentUser,
      isShared: false
    },
    {
      id: 5,
      title: "Gratidão que Liberta",
      verse: "1 Tessalonicenses 5:18",
      date: "04 Jan 2026",
      duration: "4 min",
      excerpt: "Em tudo dai graças. Descubra o poder transformador de uma vida de gratidão e como ela pode mudar sua perspectiva diária.",
      category: "Gratidão",
      author: "João Silva",
      isShared: true
    },
    {
      id: 6,
      title: "A Fidelidade de Deus",
      verse: "Lamentações 3:22-23",
      date: "03 Jan 2026",
      duration: "6 min",
      excerpt: "As misericórdias do Senhor são novas cada manhã. Grande é a Sua fidelidade. Reflita sobre a constância do amor divino em sua jornada.",
      category: "Fé",
      author: "Maria Santos",
      isShared: true
    }
  ];

  const addDevotional = async () => {
    if (!newDevotional.title || !newDevotional.verse || !newDevotional.excerpt) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const devotional = {
      ...newDevotional,
      id: Date.now(),
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      author: currentUser,
      isShared: false
    };

    try {
      await window.storage.set(`devotional:private:${devotional.id}`, JSON.stringify(devotional), false);
      setDevotionals([devotional, ...devotionals]);
      setShowAddModal(false);
      setNewDevotional({ title: '', verse: '', excerpt: '', category: 'Fé', duration: '5 min' });
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      setDevotionals([devotional, ...devotionals]);
      setShowAddModal(false);
      setNewDevotional({ title: '', verse: '', excerpt: '', category: 'Fé', duration: '5 min' });
    }
  };

  const toggleShare = async (devotional, e) => {
    e.stopPropagation();
    
    if (devotional.author !== currentUser) {
      alert('Você só pode alterar a visibilidade dos seus próprios devocionais!');
      return;
    }

    const newSharedState = !devotional.isShared;
    const updatedDevotional = { ...devotional, isShared: newSharedState };
    
    try {
      const oldKey = devotional.isShared 
        ? `devotional:shared:${devotional.id}` 
        : `devotional:private:${devotional.id}`;
      
      await window.storage.delete(oldKey, devotional.isShared);
      
      const newKey = newSharedState 
        ? `devotional:shared:${devotional.id}` 
        : `devotional:private:${devotional.id}`;
      
      await window.storage.set(newKey, JSON.stringify(updatedDevotional), newSharedState);
      
      setDevotionals(devotionals.map(d => 
        d.id === devotional.id ? updatedDevotional : d
      ));
      
    } catch (error) {
      console.error('Erro ao alterar visibilidade:', error);
      setDevotionals(devotionals.map(d => 
        d.id === devotional.id ? updatedDevotional : d
      ));
    }
  };

  const toggleLike = (id) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Fé': 'bg-blue-100 text-blue-700',
      'Amor': 'bg-red-100 text-red-700',
      'Esperança': 'bg-green-100 text-green-700',
      'Paz': 'bg-purple-100 text-purple-700',
      'Gratidão': 'bg-yellow-100 text-yellow-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Devocionais Diários</h1>
          <p className="text-gray-400 mb-6">Alimente sua fé com reflexões inspiradoras</p>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Novo Devocional
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devotionals.map((dev) => (
            <div
              key={dev.id}
              className="bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-700"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4">
                <div className="flex items-start justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(dev.category)}`}>
                    {dev.category}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {/* Toggle de Compartilhamento */}
                    {dev.author === currentUser && (
                      <button
                        onClick={(e) => toggleShare(dev, e)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          dev.isShared ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                        title={dev.isShared ? 'Público - clique para tornar privado' : 'Privado - clique para tornar público'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            dev.isShared ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                        <span className="absolute inset-0 flex items-center justify-center">
                          {dev.isShared ? (
                            <Globe className="w-3 h-3 text-white ml-1" />
                          ) : (
                            <Lock className="w-3 h-3 text-gray-600 mr-1" />
                          )}
                        </span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => toggleLike(dev.id)}
                      className="transition-transform hover:scale-110"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          liked[dev.id] ? 'fill-red-500 text-red-500' : 'text-white'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {dev.title}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-purple-400 mb-3">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{dev.author}</span>
                  {dev.author !== currentUser && (
                    <span className="ml-auto">
                      {dev.isShared ? (
                        <Globe className="w-4 h-4 text-green-400" title="Público" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-500" title="Privado" />
                      )}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{dev.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{dev.duration}</span>
                  </div>
                </div>

                <div className="bg-purple-900 bg-opacity-30 border-l-4 border-purple-500 p-3 mb-4">
                  <p className="text-sm font-semibold text-purple-300">{dev.verse}</p>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {dev.excerpt}
                </p>

                <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                  Ler Devocional
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Adicionar */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50" onClick={() => setShowAddModal(false)}>
            <div className="bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700" onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-white">
                <h2 className="text-2xl font-bold">Novo Devocional</h2>
                <p className="text-purple-100 mt-1">Crie uma reflexão inspiradora</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={newDevotional.title}
                    onChange={(e) => setNewDevotional({...newDevotional, title: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: A Paz que Excede Todo Entendimento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Versículo *
                  </label>
                  <input
                    type="text"
                    value={newDevotional.verse}
                    onChange={(e) => setNewDevotional({...newDevotional, verse: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: Filipenses 4:7"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Categoria
                    </label>
                    <select
                      value={newDevotional.category}
                      onChange={(e) => setNewDevotional({...newDevotional, category: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option>Fé</option>
                      <option>Amor</option>
                      <option>Esperança</option>
                      <option>Paz</option>
                      <option>Gratidão</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Duração de Leitura
                    </label>
                    <input
                      type="text"
                      value={newDevotional.duration}
                      onChange={(e) => setNewDevotional({...newDevotional, duration: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ex: 5 min"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Conteúdo *
                  </label>
                  <textarea
                    value={newDevotional.excerpt}
                    onChange={(e) => setNewDevotional({...newDevotional, excerpt: e.target.value})}
                    rows="6"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Escreva sua reflexão devocional..."
                  />
                </div>

                <div className="bg-blue-900 bg-opacity-30 border-l-4 border-blue-500 p-4">
                  <p className="text-sm text-blue-300">
                    <strong>Autor:</strong> {currentUser}
                  </p>
                  <p className="text-xs text-blue-400 mt-1">
                    O devocional será criado como privado. Use o botão de compartilhar no card para torná-lo público.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={addDevotional}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                  >
                    Criar Devocional
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all duration-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}