import React, { useState } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  Loader2,
  Check,
  X,
  BookOpen,
  Image as ImageIcon,
} from 'lucide-react';
import api from '../services/api';

const CreateDevotional = () => {
  const [formData, setFormData] = useState({
    livro: '',
    capitulo: '',
    versiculo: '',
    categoriaNome: '',
    reflexao: '',
    imageUrl: '',
    desafios: [],
  });

  const [desafioTemp, setDesafioTemp] = useState({ titulo: '', descricao: '' });

  // Galeria
  const [imagens, setImagens] = useState([]); // [{id,url,desc}]
  const [loadingImagens, setLoadingImagens] = useState(false);
  const [mostrarGaleria, setMostrarGaleria] = useState(false);
  const [seed, setSeed] = useState(0); // força “outras fotos”

  // Submit
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const categoriasSugeridas = [
    'Confiança em Deus',
    'Fé',
    'Amor',
    'Esperança',
    'Gratidão',
    'Sabedoria',
    'Paz',
  ];

  // Padroniza URL do Unsplash (evita “parecer que mudou” por causa de parâmetros diferentes)
  const normalizeUnsplashUrl = (url) => {
    if (!url) return '';
    const base = String(url).split('?')[0];
    return `${base}?auto=format&fit=crop&q=80&w=1080`;
  };

  const normalizeGaleria = (data) => {
    const items = Array.isArray(data) ? data : [];

    return items
      .map((item, i) => {
        if (typeof item === 'string') {
          return { id: i, url: item, desc: '' };
        }
        return {
          id: i,
          url: item?.url,
          desc: item?.desc || item?.alt_description || '',
        };
      })
      .filter((x) => !!x.url);
  };

  const buscarImagens = async ({ forceNew = false } = {}) => {
    if (!formData.categoriaNome) {
      setMensagem({
        tipo: 'erro',
        texto: 'Selecione uma categoria primeiro para buscar fotos relevantes.',
      });
      return;
    }

    setLoadingImagens(true);
    setMostrarGaleria(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      // Para não repetir sempre:
      // - randomiza page (1..5)
      // - seed muda quando clicar em “Carregar outras”
      const page = Math.floor(Math.random() * 5) + 1;
      const tam = 10;

      const nextSeed = forceNew ? seed + 1 : seed;

      const response = await api.get('/fotos/galeria', {
        params: {
          query: formData.categoriaNome,
          page,
          tam,
          seed: nextSeed,
        },
      });

      const normalized = normalizeGaleria(response.data);
      setImagens(normalized);

      if (normalized.length === 0) {
        setMensagem({
          tipo: 'erro',
          texto: 'Nenhuma imagem encontrada para essa categoria.',
        });
      }
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Não foi possível carregar imagens.' });
    } finally {
      setLoadingImagens(false);
    }
  };

  const adicionarDesafio = () => {
    if (!desafioTemp.titulo.trim()) return;

    setFormData((prev) => ({
      ...prev,
      desafios: [...prev.desafios, { ...desafioTemp }],
    }));
    setDesafioTemp({ titulo: '', descricao: '' });
  };

  const removerDesafio = (index) => {
    setFormData((prev) => ({
      ...prev,
      desafios: prev.desafios.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async () => {
    setSalvando(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      // Debug: confirme que a imagem selecionada é a que vai no payload
      console.log('ENVIANDO imageUrl:', formData.imageUrl);

      await api.post('/devocional', formData);

      setMensagem({ tipo: 'sucesso', texto: 'Devocional publicado!' });

      // opcional: limpar o formulário após sucesso
      // setFormData({ livro:'', capitulo:'', versiculo:'', categoriaNome:'', reflexao:'', imageUrl:'', desafios:[] });
      // setImagens([]); setMostrarGaleria(false);
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar.' });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        {/* Header Simples */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-800">Novo Devocional</h1>
          <p className="text-slate-500 text-sm">
            Preencha os campos abaixo para registrar sua meditação.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* Feedback de Mensagem */}
          {mensagem.texto && (
            <div
              className={`p-4 text-sm flex items-center gap-2 ${mensagem.tipo === 'sucesso'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
                }`}
            >
              {mensagem.tipo === 'sucesso' ? <Check size={16} /> : <X size={16} />}
              {mensagem.texto}
            </div>
          )}

          <div className="p-8 space-y-8">
            {/* Seção 1: Referência */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <BookOpen size={14} /> Referência Bíblica
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Livro (ex: Salmos)"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    value={formData.livro}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, livro: e.target.value }))
                    }
                  />
                </div>

                <input
                  type="text"
                  placeholder="Cap."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:border-indigo-500 outline-none"
                  value={formData.capitulo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, capitulo: e.target.value }))
                  }
                />

                <input
                  type="text"
                  placeholder="Vers."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:border-indigo-500 outline-none"
                  value={formData.versiculo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, versiculo: e.target.value }))
                  }
                />
              </div>
            </section>

            {/* Seção 2: Conteúdo */}
            <section className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Categoria
                </label>
                <select
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-white outline-none focus:border-indigo-500"
                  value={formData.categoriaNome}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Um único set (evita sobrescrita)
                    setFormData((prev) => ({
                      ...prev,
                      categoriaNome: value,
                      imageUrl: '', // reseta imagem ao mudar categoria
                    }));

                    setImagens([]);
                    setMostrarGaleria(false);
                  }}
                >
                  <option value="">Selecione um tema...</option>
                  {categoriasSugeridas.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Reflexão
                </label>
                <textarea
                  placeholder="O que Deus falou ao seu coração?"
                  rows={5}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:border-indigo-500 outline-none resize-none"
                  value={formData.reflexao}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, reflexao: e.target.value }))
                  }
                />
              </div>
            </section>

            {/* Seção 3: Imagem Estilo Galeria Clean */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <ImageIcon size={14} /> Capa do Devocional
              </h2>

              {!formData.imageUrl ? (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => buscarImagens()}
                    disabled={loadingImagens}
                    className="w-full py-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col items-center justify-center gap-2"
                  >
                    {loadingImagens ? <Loader2 className="animate-spin" /> : <Upload size={24} />}
                    <span className="text-sm font-medium">Buscar fotos inspiradoras</span>
                    <span className="text-xs text-slate-400">
                      {formData.categoriaNome
                        ? `Tema: ${formData.categoriaNome}`
                        : 'Selecione uma categoria'}
                    </span>
                  </button>

                  {mostrarGaleria && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-400">
                          Clique numa foto para selecionar
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            setSeed((s) => s + 1);
                            buscarImagens({ forceNew: true });
                          }}
                          disabled={loadingImagens}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-60"
                        >
                          {loadingImagens ? 'Carregando...' : 'Carregar outras'}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 animate-in fade-in duration-500">
                        {imagens.map((img) => {
                          const selected = formData.imageUrl === normalizeUnsplashUrl(img.url);

                          return (
                            <button
                              type="button"
                              key={img.id}
                              onClick={() => {
                                const chosen = normalizeUnsplashUrl(img.url);
                                console.log('Selecionada:', chosen);
                                setFormData((prev) => ({ ...prev, imageUrl: chosen }));
                              }}
                              className={`aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-all shadow-sm relative ${selected
                                ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                                : 'border-transparent hover:border-indigo-500'
                                }`}
                              title={img.desc || 'Selecionar imagem'}
                            >
                              <img
                                src={normalizeUnsplashUrl(img.url)}
                                className="w-full h-full object-cover"
                                alt={img.desc || 'Opção'}
                                loading="lazy"
                              />

                              {selected && (
                                <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-1 shadow">
                                  <Check size={14} />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative group rounded-xl overflow-hidden shadow-md">
                  <img
                    src={formData.imageUrl}
                    className="w-full h-48 object-cover"
                    alt="Preview"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
                    className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                  >
                    <span className="bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                      <X size={14} /> Trocar Imagem
                    </span>
                  </button>
                </div>
              )}
            </section>

            {/* Seção 4: Desafios Compactos */}
            <section className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Prática e Desafios</h3>

              <div className="space-y-3 mb-4">
                {formData.desafios.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-white p-3 rounded-md border border-slate-200 shadow-sm"
                  >
                    <div className="text-sm">
                      <span className="font-bold text-indigo-600"># </span> {d.titulo}
                    </div>
                    <button type="button" onClick={() => removerDesafio(i)}>
                      <Trash2 size={14} className="text-slate-400 hover:text-rose-500" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Título do desafio..."
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-md outline-none focus:border-indigo-500"
                  value={desafioTemp.titulo}
                  onChange={(e) =>
                    setDesafioTemp((prev) => ({ ...prev, titulo: e.target.value }))
                  }
                />

                <button
                  type="button"
                  onClick={adicionarDesafio}
                  className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-all"
                  title="Adicionar desafio"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="mt-2">
                <textarea
                  placeholder="Descrição (opcional)..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md outline-none focus:border-indigo-500 resize-none"
                  value={desafioTemp.descricao}
                  onChange={(e) =>
                    setDesafioTemp((prev) => ({ ...prev, descricao: e.target.value }))
                  }
                />
              </div>
            </section>

            {/* Botão Final */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={salvando}
              className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {salvando ? <Loader2 className="animate-spin" /> : 'Publicar Devocional'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDevotional;
