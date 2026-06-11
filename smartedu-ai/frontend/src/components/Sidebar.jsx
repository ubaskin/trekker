import { MODULES } from '../App.jsx';

/**
 * Chap tomondagi asosiy navigatsiya paneli — 3 ta modul orasida almashish.
 */
export default function Sidebar({ active, onSelect }) {
  return (
    <aside className="w-64 shrink-0 bg-brand-900 text-white flex flex-col">
      <div className="px-5 py-6 border-b border-white/10">
        <h1 className="text-xl font-extrabold tracking-tight">
          🎓 SmartEdu <span className="text-brand-100">AI</span>
        </h1>
        <p className="text-xs text-white/50 mt-1">Innovatsion ta'lim platformasi</p>
      </div>

      <nav className="flex-1 p-3 space-y-1.5">
        {MODULES.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
              active === m.id
                ? 'bg-brand-500 shadow-lg shadow-brand-500/30'
                : 'hover:bg-white/10'
            }`}
          >
            <span className="text-lg mr-2">{m.icon}</span>
            <span className="font-semibold">{m.name}</span>
            <p className="text-xs text-white/60 mt-0.5 ml-7">{m.desc}</p>
          </button>
        ))}
      </nav>

      <div className="p-4 text-xs text-white/40 border-t border-white/10">
        MVP v1.0 · {new Date().getFullYear()}
      </div>
    </aside>
  );
}
