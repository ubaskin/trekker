import { useState } from 'react';

const DIFFICULTIES = ['Oson', "O'rta", 'Qiyin'];
const SUGGESTED_TOPICS = ['Fotosintez', 'Nyuton qonunlari', 'Davriy jadval', 'Kvadrat tenglamalar'];

/**
 * Test parametrlari formasi: mavzu, savollar soni, qiyinchilik darajasi.
 */
export default function QuizSetup({ onGenerate, error }) {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState("O'rta");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim().length < 2) return;
    onGenerate({ topic: topic.trim(), count, difficulty });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          ⚠️ {error}
        </div>
      )}

      {/* Mavzu */}
      <div>
        <label className="block font-semibold text-slate-700 mb-2">Test mavzusi</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Masalan: Fotosintez"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {SUGGESTED_TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              className="px-3 py-1 text-xs rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Savollar soni */}
      <div>
        <label className="block font-semibold text-slate-700 mb-2">
          Savollar soni: <span className="text-brand-600">{count} ta</span>
        </label>
        <input
          type="range"
          min={3}
          max={10}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-full accent-brand-500"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>3</span>
          <span>10</span>
        </div>
      </div>

      {/* Qiyinchilik darajasi */}
      <div>
        <label className="block font-semibold text-slate-700 mb-2">Qiyinchilik darajasi</label>
        <div className="grid grid-cols-3 gap-3">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`py-3 rounded-xl font-semibold transition-colors ${
                difficulty === d
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d === 'Oson' ? '🟢' : d === "O'rta" ? '🟡' : '🔴'} {d}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={topic.trim().length < 2}
        className="w-full py-4 rounded-xl bg-brand-500 text-white font-bold text-lg hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ✨ Testni yaratish
      </button>
    </form>
  );
}
