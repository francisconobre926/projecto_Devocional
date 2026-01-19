import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Clock, X, Search, RotateCcw, ChevronRight, ChevronLeft, BadgeCheck, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import api from '../services/api';

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
  const title = verseLabel(d.livro, d.capitulo, d.versiculo) || 'Devocional';
  const verse = verseLabel(d.livro, d.capitulo, d.versiculo) || '';
  const excerpt = lineClampText(d.reflexao, 'Sem reflexão.');
  const category = d.categoria?.nome || 'Fé';
  const author = d.usuario?.nome || 'Autor';

  const searchIndex = `${title} ${verse} ${excerpt} ${category} ${author}`.toLowerCase();

  return {
    id: d.id,
    title,
    verse,
    excerpt,
    category,
    author,
    duration,
    imageUrl: d.imageUrl || null,
    desafios: Array.isArray(d.desafios) ? d.desafios : [],
    partilhado: Boolean(d.partilhado),
    verificado: true,
    searchIndex
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

// ---- template export (tipo post recorte) ----
function TweetExportCard({ devotional }) {
  const theme = CATEGORY_THEMES[devotional.category] || CATEGORY_THEMES['Fé'];

  return (
    <div
      style={{
        width: 900,
        borderRadius: 28,
        border: '1px solid #E2E8F0',
        background: '#ffffff',
        overflow: 'hidden',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial'
      }}
    >
      <div style={{ position: 'relative', height: 260 }}>
        <img
          src={devotional.imageUrl || theme.img}
          alt="Capa"
          crossOrigin="anonymous"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,.10))'
          }}
        />
        <div style={{ position: 'absolute', left: 28, bottom: 22, right: 28 }}>
          <div style={{ color: 'rgba(255,255,255,.85)', fontWeight: 900, letterSpacing: 1.2, fontSize: 12, textTransform: 'uppercase' }}>
            {devotional.category}
          </div>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 34, lineHeight: 1.1, marginTop: 6 }}>
            {devotional.title}
          </div>
          <div style={{ color: 'rgba(255,255,255,.85)', fontWeight: 800, fontSize: 12, marginTop: 10 }}>
            {devotional.verse}
          </div>
        </div>
      </div>

      <div style={{ padding: 26 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 999,
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              color: '#0F172A',
              fontSize: 18
            }}
          >
            {devotional.author?.charAt(0)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 900, color: '#0F172A', fontSize: 16 }}>
                {devotional.author}
              </span>
              {devotional.verificado && (
                <span style={{ fontWeight: 900, fontSize: 12, color: '#2563EB' }}>
                  Verificado
                </span>
              )}
            </div>
            <span style={{ color: '#64748B', fontSize: 12, fontWeight: 700 }}>
              Devocional • {devotional.duration}
            </span>
          </div>
        </div>

        <div style={{ marginTop: 18, color: '#0F172A', fontSize: 22, lineHeight: 1.45, fontWeight: 600, whiteSpace: 'pre-line' }}>
          {devotional.excerpt}
        </div>

        {devotional.desafios?.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 900, fontSize: 12, color: '#334155', letterSpacing: 0.8, textTransform: 'uppercase' }}>
              Desafios
            </div>
            <div style={{ marginTop: 10, display: 'grid', gap: 10 }}>
              {devotional.desafios.slice(0, 2).map((d, idx) => (
                <div key={idx} style={{ border: '1px solid #E2E8F0', borderRadius: 18, padding: 12, background: '#F8FAFC' }}>
                  <div style={{ fontWeight: 900, fontSize: 13, color: '#0F172A' }}>{d.titulo}</div>
                  <div style={{ marginTop: 4, fontSize: 13, color: '#475569' }}>{d.descricao}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8', fontSize: 12, fontWeight: 800 }}>
          <span>@devocionais</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function SharedDevotionalsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const [selectedDevotional, setSelectedDevotional] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // paginação (servidor)
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const exportRef = useRef(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg('');

        const response = await api.get('/devocional/partilhados', {
          params: { pag: page, size }
        });

        const content = response?.data?.content ?? [];
        if (!alive) return;

        const mapped = content.map(mapDevocionalFromApi);

        // garantia extra: só partilhados
        setData(mapped.filter((x) => x.partilhado));
        setTotalPages(response?.data?.totalPages ?? 0);
        setTotalElements(response?.data?.totalElements ?? 0);
      } catch (err) {
        if (alive) {
          setErrorMsg('Não foi possível carregar os devocionais partilhados.');
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
    const s = searchTerm.toLowerCase().trim();

    return data.filter((item) => {
      const matchesSearch = s === '' ? true : item.searchIndex.includes(s);
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

  async function baixarDevocionalComoImagem() {
    if (!exportRef.current || !selectedDevotional) return;

    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `devocional-partilhado-${selectedDevotional.id}.png`;
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
            Devocionais Partilhados
          </h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">
            Explore devocionais publicados pela comunidade.
          </p>
        </div>

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
                placeholder="Pesquisar por livro, versículo, texto, autor..."
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
                    <div className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border backdrop-blur-md bg-white/20 text-white border-white/20">
                      PARTILHADO
                    </div>
                  </div>
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
            <h3 className="text-xl font-bold text-slate-800">Nenhum devocional encontrado</h3>
            <p className="text-slate-400 mt-2">Tente ajustar filtros ou pesquisa.</p>
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

                <div className="flex items-center justify-between gap-3 pr-10">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                        CATEGORY_THEMES[selectedDevotional.category]?.bg ?? CATEGORY_THEMES['Fé'].bg
                      } ${
                        CATEGORY_THEMES[selectedDevotional.category]?.color ?? CATEGORY_THEMES['Fé'].color
                      } ${
                        CATEGORY_THEMES[selectedDevotional.category]?.border ?? CATEGORY_THEMES['Fé'].border
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
                </div>

                <div className="mt-6 rounded-[32px] border border-slate-200 overflow-hidden bg-white">
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

        {/* EXPORT (fora da tela) */}
        <div style={{ position: 'fixed', left: '-99999px', top: 0 }}>
          {selectedDevotional && (
            <div ref={exportRef}>
              <TweetExportCard devotional={selectedDevotional} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
