
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Clock,
  Heart,
  X,
  Search,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Share2,
  BadgeCheck,
  Download
} from 'lucide-react';
import html2canvas from 'html2canvas';
import api from '../services/api'; // ajuste o caminho

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

// --------- helpers ----------
function verseLabel(livro, capitulo, versiculo) {
  const l = livro?.trim() || '';
  const c = capitulo?.trim() || '';
  const v = versiculo?.trim() || '';
  if (!l && !c && !v) return '';
  return `${l} ${c}:${v}`.trim();
}

function lineClampText(text, fallback = '') {
  const t = (text ?? '').trim();
  return t.length ? t : fallback;
}

function mapDevocionalFromApi(d) {
  const duration = '5 min';

  return {
    id: d.id,
    title: verseLabel(d.livro, d.capitulo, d.versiculo) || 'Devocional',
    verse: verseLabel(d.livro, d.capitulo, d.versiculo) || '',
    excerpt: lineClampText(d.reflexao, 'Sem reflexão.'),
    category: d.categoria?.nome || 'Fé',
    author: d.usuario?.nome || 'Você',
    duration,
    imageUrl: d.imageUrl || null,
    desafios: Array.isArray(d.desafios) ? d.desafios : [],
    partilhado: Boolean(d.partilhado),
    // Se no futuro existir no backend, podes usar:
    // verificado: Boolean(d.usuario?.verificado)
    verificado: true // por enquanto sempre mostra o selo
  };
}

function getPageWindow(current, total, windowSize = 7) {
  if (total <= windowSize) return [...Array(total)].map((_, i) => i);

  const half = Math.floor(windowSize / 2);
  let start = current - half;
  let end = current + half;

  if (start < 0) {
    start = 0;
    end = windowSize - 1;
  }
  if (end > total - 1) {
    end = total - 1;
    start = total - windowSize;
  }

  return [...Array(end - start + 1)].map((_, i) => start + i);
}

export default function MyDevotionalsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const [selectedDevotional, setSelectedDevotional] = useState(null);
  const [liked, setLiked] = useState({});

  const [errorMsg, setErrorMsg] = useState('');

  // -------- paginação --------
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // loading por item para o botão publicar
  const [publishing, setPublishing] = useState({});

  // ref do card para download
  const devotionalCardRef = useRef(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg('');

        const response = await api.get('/devocional/listar', {
          params: { pag: page, size }
        });

        const content = response?.data?.content ?? [];
        if (!alive) return;

        setData(content.map(mapDevocionalFromApi));
        setTotalPages(response?.data?.totalPages ?? 0);
        setTotalElements(response?.data?.totalElements ?? 0);
      } catch (err) {
        if (alive) {
          setErrorMsg('Não foi possível carregar seus devocionais.');
          setData([]);
          setTotalPages(0);
          setTotalElements(0);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [page, size]);

  const filteredItems = useMemo(() => {
    return data.filter((item) => {
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(s) ||
        item.verse.toLowerCase().includes(s) ||
        item.excerpt.toLowerCase().includes(s);

      const matchesCat = filterCategory === 'All' || item.category === filterCategory;

      return matchesSearch && matchesCat;
    });
  }, [data, searchTerm, filterCategory]);

  const showPagination =
    !loading &&
    !errorMsg &&
    filterCategory === 'All' &&
    searchTerm.trim() === '' &&
    totalPages > 1;

  const pageButtons = useMemo(() => getPageWindow(page, totalPages, 7), [page, totalPages]);

  async function togglePublish(e, item) {
    e.stopPropagation();
    const nextValue = !item.partilhado;

    try {
      setPublishing((prev) => ({ ...prev, [item.id]: true }));
      setErrorMsg('');

      await api.patch(`/devocional/atualizar/${item.id}`, { partilhado: nextValue });

      setData((prev) => prev.map((d) => (d.id === item.id ? { ...d, partilhado: nextValue } : d)));
      setSelectedDevotional((prev) => (prev?.id === item.id ? { ...prev, partilhado: nextValue } : prev));
    } catch (err) {
      setErrorMsg('Não foi possível atualizar a partilha deste devocional.');
    } finally {
      setPublishing((prev) => ({ ...prev, [item.id]: false }));
    }
  }

  async function baixarDevocionalComoImagem() {
    if (!devotionalCardRef.current || !selectedDevotional) return;

    try {
      const canvas = await html2canvas(devotionalCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `devocional-${selectedDevotional.id}.png`;
      a.click();
    } catch (e) {
      setErrorMsg('Não foi possível gerar a imagem para download (CORS).');
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            Meus Devocionais
          </h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">
            Somente os devocionais criados por você.
          </p>
        </div>

        {/* ERRO */}
        {errorMsg && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-600 font-bold">
            {errorMsg}
          </div>
        )}

        {/* FILTROS */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar por livro, capítulo, versículo ou texto..."
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

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="relative">
                <select
                  className="
                    h-11 min-w-[220px]
                    appearance-none
                    rounded-2xl border border-slate-200 bg-white
                    px-4 pr-10
                    text-xs font-black tracking-wide text-slate-700
                    shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300
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

              {(filterCategory !== 'All' || searchTerm) && (
                <button
                  onClick={() => {
                    setFilterCategory('All');
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
            <span>
              {loading ? 'Carregando...' : `${filteredItems.length} resultado(s) • ${totalElements} no total`}
            </span>
            {(filterCategory !== 'All' || searchTerm) && <span className="hidden sm:inline">Filtros ativos</span>}
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredItems.map((item) => {
            const theme = CATEGORY_THEMES[item.category] || CATEGORY_THEMES['Fé'];
            const isPublishing = Boolean(publishing[item.id]);
            const isShared = Boolean(item.partilhado);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedDevotional(item)}
                className="group bg-white rounded-[40px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 cursor-pointer flex flex-col h-full"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.imageUrl || theme.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border backdrop-blur-md bg-white/90 ${theme.color} border-white/20`}
                    >
                      {item.category}
                    </span>

                    <button
                      onClick={(e) => togglePublish(e, item)}
                      disabled={isPublishing}
                      className={`
                        px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase
                        border backdrop-blur-md transition
                        ${isShared
                          ? 'bg-emerald-500/90 text-white border-emerald-200'
                          : 'bg-white/20 text-white border-white/20 hover:bg-white/35'}
                        ${isPublishing ? 'opacity-60 cursor-not-allowed' : ''}
                      `}
                      title={isShared ? 'Desativar partilha' : 'Publicar (ativar partilha)'}
                      aria-label={isShared ? 'Desativar partilha' : 'Publicar'}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Share2 className="w-3 h-3" />
                        {isShared ? 'PARTILHADO' : 'PUBLICAR'}
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLiked((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
                    }}
                    className={`absolute top-6 right-6 p-2.5 rounded-full backdrop-blur-md transition-all ${liked[item.id] ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'
                      }`}
                    aria-label="Favoritar"
                    title="Favoritar"
                  >
                    <Heart className={`w-4 h-4 ${liked[item.id] ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="p-8 flex flex-col flex-1 bg-slate-50 border-t border-slate-200">
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
                        <span className="text-xs font-bold text-slate-700">{item.author}</span>
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

        {/* VAZIO */}
        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-40">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Nenhum registro encontrado</h3>
            <p className="text-slate-400 mt-2">Tente ajustar seus filtros ou termos de pesquisa.</p>
          </div>
        )}

        {/* PAGINAÇÃO */}
        {showPagination && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400">
              Página <span className="font-black text-slate-700">{page + 1}</span> de{' '}
              <span className="font-black text-slate-700">{totalPages}</span> • Total:{' '}
              <span className="font-black text-slate-700">{totalElements}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className={`
                  h-9 px-3 rounded-xl border text-[10px] font-black shadow-sm transition
                  inline-flex items-center gap-1.5
                  ${page === 0
                    ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}
                `}
                aria-label="Página anterior"
                title="Anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                ANTERIOR
              </button>

              {pageButtons[0] > 0 && (
                <>
                  <button
                    onClick={() => setPage(0)}
                    className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-[10px] font-black text-slate-700 hover:bg-slate-50 shadow-sm transition"
                    title="Primeira página"
                  >
                    1
                  </button>
                  <span className="px-1 text-slate-400 font-black text-xs">…</span>
                </>
              )}

              {pageButtons.map((p) => {
                const active = p === page;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`
                      h-9 w-9 rounded-xl border text-[10px] font-black shadow-sm transition
                      ${active
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}
                    `}
                    title={`Ir para página ${p + 1}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {p + 1}
                  </button>
                );
              })}

              {pageButtons[pageButtons.length - 1] < totalPages - 1 && (
                <>
                  <span className="px-1 text-slate-400 font-black text-xs">…</span>
                  <button
                    onClick={() => setPage(totalPages - 1)}
                    className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-[10px] font-black text-slate-700 hover:bg-slate-50 shadow-sm transition"
                    title="Última página"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className={`
                  h-9 px-3 rounded-xl border text-[10px] font-black shadow-sm transition
                  inline-flex items-center gap-1.5
                  ${page >= totalPages - 1
                    ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}
                `}
                aria-label="Próxima página"
                title="Próximo"
              >
                PRÓXIMO
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* MODAL */}
        {selectedDevotional && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setSelectedDevotional(null)}
            />

            <div className="relative bg-white w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh] animate-in zoom-in duration-300">
              <div className="hidden md:block w-2/5 relative">
                <img
                  src={selectedDevotional.imageUrl || CATEGORY_THEMES[selectedDevotional.category]?.img}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Devotional"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              </div>

              <div className="flex-1 p-8 md:p-10 overflow-y-auto bg-white relative">
                <button
                  onClick={() => setSelectedDevotional(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors"
                  aria-label="Fechar"
                  title="Fechar"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>

                {/* TOP DO MODAL (categoria + autor verificado + botoes) */}
                <div className="flex items-center justify-between gap-3 pr-10">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${CATEGORY_THEMES[selectedDevotional.category]?.bg ?? CATEGORY_THEMES['Fé'].bg
                        } ${CATEGORY_THEMES[selectedDevotional.category]?.color ?? CATEGORY_THEMES['Fé'].color
                        } ${CATEGORY_THEMES[selectedDevotional.category]?.border ?? CATEGORY_THEMES['Fé'].border
                        }`}
                    >
                      {selectedDevotional.category}
                    </span>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-black text-slate-700">{selectedDevotional.author}</span>
                      {selectedDevotional.verificado && (
                        <BadgeCheck className="w-4 h-4 text-blue-600" title="Verificado" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        baixarDevocionalComoImagem();
                      }}
                      className="
                        h-9 px-3 rounded-xl border border-slate-200 bg-white
                        text-[10px] font-black tracking-widest text-slate-700
                        hover:bg-slate-50 shadow-sm transition
                        inline-flex items-center gap-2
                      "
                      title="Baixar como imagem"
                    >
                      <Download className="w-4 h-4" />
                      BAIXAR
                    </button>

                    <button
                      onClick={(e) => togglePublish(e, selectedDevotional)}
                      disabled={Boolean(publishing[selectedDevotional.id])}
                      className={`
                        h-9 px-3 rounded-xl border text-[10px] font-black tracking-widest
                        shadow-sm transition inline-flex items-center gap-2
                        ${selectedDevotional.partilhado
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}
                        ${publishing[selectedDevotional.id] ? 'opacity-60 cursor-not-allowed' : ''}
                      `}
                      title={selectedDevotional.partilhado ? 'Desativar partilha' : 'Publicar (ativar partilha)'}
                    >
                      <Share2 className="w-4 h-4" />
                      {selectedDevotional.partilhado ? 'PARTILHADO' : 'PUBLICAR'}
                    </button>
                  </div>
                </div>

                {/* CARD EXPORTÁVEL */}
                <div
                  ref={devotionalCardRef}
                  className="mt-6 rounded-[32px] border border-slate-200 overflow-hidden bg-white"
                >
                  <div className="relative h-44">
                    <img
                      src={selectedDevotional.imageUrl || CATEGORY_THEMES[selectedDevotional.category]?.img}
                      alt="Capa"
                      className="absolute inset-0 w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />

                    <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
                      <div>
                        <div className="text-white/90 text-[11px] font-black tracking-widest uppercase">
                          {selectedDevotional.category}
                        </div>
                        <div className="text-white text-2xl font-black leading-tight">
                          {selectedDevotional.title}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white/15 border border-white/20 text-white px-3 py-1.5 rounded-xl text-[10px] font-black backdrop-blur">
                        <Clock className="w-3.5 h-3.5" />
                        {selectedDevotional.duration?.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[12px] font-black text-slate-700 border border-slate-200">
                          {selectedDevotional.author?.charAt(0)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-slate-800">
                            {selectedDevotional.author}
                          </span>
                          {selectedDevotional.verificado && (
                            <BadgeCheck className="w-4 h-4 text-blue-600" title="Verificado" />
                          )}
                        </div>
                      </div>

                      <div className="text-[10px] font-black text-slate-400">
                        {selectedDevotional.verse}
                      </div>
                    </div>

                    <div className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <p className="text-slate-700 italic font-serif text-lg leading-relaxed">
                        "{selectedDevotional.verse}"
                      </p>
                    </div>

                    <p className="mt-4 text-slate-600 leading-relaxed whitespace-pre-line">
                      {selectedDevotional.excerpt}
                    </p>

                    {selectedDevotional.desafios?.length > 0 && (
                      <div className="mt-6">
                        <div className="text-xs font-black tracking-wide text-slate-700 mb-3">
                          Desafios
                        </div>
                        <div className="space-y-2">
                          {selectedDevotional.desafios.map((d, idx) => (
                            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-3">
                              <div className="text-xs font-black text-slate-800">{d.titulo}</div>
                              <div className="text-sm text-slate-500 mt-1">{d.descricao}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
