import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Heart,
  X,
  Search,
  RotateCcw,
  ChevronRight
} from 'lucide-react';

// --- CONFIGURAÇÃO VISUAL ---
const CATEGORY_THEMES = {
  'Fé': {
    img: 'https://images.unsplash.com/photo-1507502707541-f369a3b18502?auto=format&fit=crop&q=80&w=600',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100'
  },
  'Amor': {
    img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-100'
  },
  'Esperança': {
    img: 'https://images.unsplash.com/photo-1470252649358-96bf51884b06?auto=format&fit=crop&q=80&w=600',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100'
  },
  'Paz': {
    img: 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&q=80&w=600',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100'
  },
  'Gratidão': {
    img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100'
  }
};

export default function DevotionalsProfessional() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterAuthor, setFilterAuthor] = useState('All');

  const [selectedDevotional, setSelectedDevotional] = useState(null);
  const [liked, setLiked] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setData(getDefaultData());
      setLoading(false);
    }, 400);
  }, []);

  const authors = useMemo(() => {
    return ['All', ...new Set(data.map(d => d.author))];
  }, [data]);

  const filteredItems = useMemo(() => {
    return data.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.verse.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = filterCategory === 'All' || item.category === filterCategory;
      const matchesAuthor = filterAuthor === 'All' || item.author === filterAuthor;

      return matchesSearch && matchesCat && matchesAuthor;
    });
  }, [data, searchTerm, filterCategory, filterAuthor]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans p-6 md:p-12">

      <div className="max-w-7xl mx-auto">

        {/* MENU DE FILTROS (REFATORADO) */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
            {/* Pesquisa */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar por título ou versículo..."
                className="
                  w-full h-11 pl-10 pr-4
                  rounded-2xl border border-slate-200 bg-white
                  text-sm font-medium text-slate-800 placeholder:text-slate-400
                  shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300
                  transition
                "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Selects + Limpar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="flex gap-3 flex-col sm:flex-row">
                <div className="relative">
                  <select
                    className="
    h-11 min-w-[190px]
    appearance-none
    rounded-2xl 
    border border-slate-200
    bg-white
    px-4 pr-10
    text-xs font-black tracking-wide text-slate-700
    shadow-sm
    focus:outline-none focus:ring-2 focus:ring-indigo-500/30
    focus:border-indigo-300
  "
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="All">TODAS CATEGORIAS</option>
                    {Object.keys(CATEGORY_THEMES).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    className="
                      h-11 min-w-[170px]
                      appearance-none
                      rounded-2xl border border-slate-200 bg-white
                      px-4 pr-10
                      text-xs font-black tracking-wide text-slate-700
                      shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300
                      transition
                    "
                    value={filterAuthor}
                    onChange={(e) => setFilterAuthor(e.target.value)}
                  >
                    {authors.map((a) => (
                      <option key={a} value={a}>
                        {a === 'All' ? 'TODOS AUTORES' : a.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              {(filterCategory !== 'All' || filterAuthor !== 'All' || searchTerm) && (
                <button
                  onClick={() => {
                    setFilterCategory('All');
                    setFilterAuthor('All');
                    setSearchTerm('');
                  }}
                  className="
                    h-11
                    inline-flex items-center justify-center gap-2
                    rounded-2xl border border-slate-200 bg-white
                    px-4
                    text-xs font-black tracking-wide text-slate-700
                    shadow-sm
                    hover:bg-slate-50
                    transition
                  "
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  LIMPAR
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>{loading ? 'Carregando...' : `${filteredItems.length} resultado(s)`}</span>
            {(filterCategory !== 'All' || filterAuthor !== 'All' || searchTerm) && (
              <span className="hidden sm:inline">Filtros ativos</span>
            )}
          </div>
        </div>

        {/* GRID DE CARDS COM FOTO E REFLEXÃO VISÍVEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredItems.map((item) => {
            const theme = CATEGORY_THEMES[item.category] || CATEGORY_THEMES['Fé'];

            return (
              <div
                key={item.id}
                onClick={() => setSelectedDevotional(item)}
                className="group bg-white rounded-[40px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 cursor-pointer flex flex-col h-full"
              >
                {/* Imagem Superior */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={theme.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-6 left-6">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border backdrop-blur-md bg-white/90 ${theme.color} border-white/20`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLiked(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                    }}
                    className={`absolute top-6 right-6 p-2.5 rounded-full backdrop-blur-md transition-all ${liked[item.id]
                      ? 'bg-red-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/40'
                      }`}
                    aria-label="Favoritar"
                    title="Favoritar"
                  >
                    <Heart className={`w-4 h-4 ${liked[item.id] ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Conteúdo Textual */}
              {/* Conteúdo Textual */}
<div
  className="
    p-8 flex flex-col flex-1
    bg-slate-50
    border-t border-slate-200
  "
>



                  <h3 className="text-2xl font-black text-slate-800 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8 italic">
                    "{item.excerpt}"
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-600 border-2 border-white shadow-sm">
                        {item.author.charAt(0)}
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                          Autor
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {item.author}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
                      <Clock className="w-3 h-3" /> {item.duration.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MENSAGEM SE VAZIO */}
        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-40">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Nenhum registro encontrado</h3>
            <p className="text-slate-400 mt-2">Tente ajustar seus filtros ou termos de pesquisa.</p>
          </div>
        )}
      </div>

      {/* MODAL DE LEITURA */}
      {selectedDevotional && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={() => setSelectedDevotional(null)}
          />

          <div className="relative bg-white w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh] animate-in zoom-in duration-300">
            {/* Lateral de Imagem do Modal */}
            <div className="hidden md:block w-2/5 relative">
              <img
                src={CATEGORY_THEMES[selectedDevotional.category]?.img}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Devotional"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            </div>

            {/* Texto do Modal */}
            <div className="flex-1 p-10 md:p-16 overflow-y-auto bg-white relative">
              <button
                onClick={() => setSelectedDevotional(null)}
                className="absolute top-8 right-8 p-2 hover:bg-slate-50 rounded-full transition-colors"
                aria-label="Fechar"
                title="Fechar"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>

              <div className="mb-10">
                <span
                  className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${CATEGORY_THEMES[selectedDevotional.category]?.bg ?? CATEGORY_THEMES['Fé'].bg
                    } ${CATEGORY_THEMES[selectedDevotional.category]?.color ?? CATEGORY_THEMES['Fé'].color
                    } ${CATEGORY_THEMES[selectedDevotional.category]?.border ?? CATEGORY_THEMES['Fé'].border
                    }`}
                >
                  {selectedDevotional.category}
                </span>

                <h2 className="text-4xl font-black text-slate-900 mt-6 leading-tight">
                  {selectedDevotional.title}
                </h2>
              </div>

              <div className="bg-slate-50 rounded-[32px] p-8 mb-10 border border-slate-100">
                <p className="text-xl font-serif italic text-slate-700 leading-relaxed">
                  "{selectedDevotional.verse}"
                </p>
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="text-slate-500 leading-loose text-lg whitespace-pre-line">
                  {selectedDevotional.excerpt}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- DADOS EXEMPLO ---
function getDefaultData() {
  return [
    {
      id: 1,
      title: "O Silêncio que Conecta",
      verse: "Salmos 46:10",
      date: "13 Jan 2026",
      duration: "5 min",
      excerpt:
        "Muitas vezes buscamos a Deus no barulho, mas é na quietude que Sua voz se torna clara. Aprender a silenciar a mente é o primeiro passo para ouvir o que o coração do Pai tem a nos dizer hoje.",
      category: "Paz",
      author: "João Silva"
    },
    {
      id: 2,
      title: "Amor: A Única Dívida",
      verse: "Romanos 13:8",
      date: "12 Jan 2026",
      duration: "4 min",
      excerpt:
        "Não devais a ninguém coisa alguma, a não ser o amor. O amor cristão não espera recompensa; ele flui de uma fonte que nunca seca porque foi preenchida primeiro na cruz de Cristo.",
      category: "Amor",
      author: "Maria Santos"
    },
    {
      id: 3,
      title: "Âncora da Alma",
      verse: "Hebreus 6:19",
      date: "11 Jan 2026",
      duration: "6 min",
      excerpt:
        "A esperança é como uma âncora: invisível sob as águas, mas essencial para manter o barco firme durante a tempestade. Mesmo quando não vemos o sol, sabemos que Ele está lá.",
      category: "Esperança",
      author: "Pedro Oliveira"
    },
    {
      id: 4,
      title: "Fé em Pequenos Passos",
      verse: "Mateus 17:20",
      date: "10 Jan 2026",
      duration: "7 min",
      excerpt:
        "A fé não exige que você veja todo o caminho, apenas que dê o primeiro passo. Como o grão de mostarda, o que parece insignificante hoje pode se tornar uma árvore de abrigo amanhã.",
      category: "Fé",
      author: "Ana Costa"
    }
  ];
}

