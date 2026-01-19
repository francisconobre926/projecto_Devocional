import React, { useState } from 'react';

// --- Sub-componentes de Template ---

const TweetTemplate = ({ text }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-4 max-w-md w-full shadow-sm font-sans">
    <div className="flex items-start mb-3">
      <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
      <div>
        <div className="font-bold text-gray-900">Usuário Incrível</div>
        <div className="text-gray-500 text-sm">@usuario_criativo</div>
      </div>
    </div>
    <p className="text-gray-900 text-xl leading-snug break-words">
      {text || "Seu texto aparecerá aqui como um tweet..."}
    </p>
    <div className="mt-3 text-gray-500 text-sm border-t pt-2">
      14:20 · 19 de Jan, 2026
    </div>
  </div>
);

const MinimalistTemplate = ({ text }) => (
  <div className="bg-[#F4F1EA] p-10 max-w-md w-full aspect-square flex flex-col justify-center items-center text-center shadow-lg border border-[#E5E2D9]">
    <span className="text-4xl text-gray-400 mb-4 font-serif">“</span>
    <p className="font-serif text-2xl italic text-gray-700 leading-relaxed break-words">
      {text || "O design é o embaixador silencioso da sua marca."}
    </p>
    <div className="mt-8 tracking-[0.3em] text-[10px] uppercase text-gray-500 border-t border-gray-300 pt-4">
      U S U Á R I O
    </div>
  </div>
);

const BoldNewsTemplate = ({ text }) => (
  <div className="bg-black p-8 max-w-md w-full aspect-video flex flex-col justify-end shadow-2xl relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-20">
      <div className="w-24 h-24 border-8 border-yellow-400 rounded-full"></div>
    </div>
    <div className="relative z-10">
      <span className="bg-yellow-400 text-black font-black px-2 py-1 text-xs uppercase mb-2 inline-block">
        Breaking News
      </span>
      <h2 className="text-white font-black text-3xl uppercase leading-none break-words">
        {text || "Título de Impacto Aqui"}
      </h2>
    </div>
  </div>
);

// --- Componente Principal ---

export default function PostGenerator() {
  const [text, setText] = useState("");
  const [template, setTemplate] = useState("tweet");

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center font-sans">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Gerador de Postagens</h1>

      {/* Editor e Seleção */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl mb-10">
        <label className="block text-sm font-medium text-gray-700 mb-2">Escreva seu conteúdo:</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          rows="3"
          placeholder="Digite algo interessante..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setTemplate("tweet")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${template === 'tweet' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Twitter Style
          </button>
          <button
            onClick={() => setTemplate("minimalist")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${template === 'minimalist' ? 'bg-stone-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Minimalista
          </button>
          <button
            onClick={() => setTemplate("bold")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${template === 'bold' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Impacto
          </button>
        </div>
      </div>

      {/* Área de Preview */}
      <div className="w-full flex justify-center items-center min-h-[400px]">
        {template === "tweet" && <TweetTemplate text={text} />}
        {template === "minimalist" && <MinimalistTemplate text={text} />}
        {template === "bold" && <BoldNewsTemplate text={text} />}
      </div>
    </div>
  );
}