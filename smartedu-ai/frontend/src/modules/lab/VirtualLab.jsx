import { useRef, useState } from 'react';
import LabScene from './LabScene.jsx';
import { INITIAL_FLASKS } from './chemistry.js';

const deepCopyFlasks = () => JSON.parse(JSON.stringify(INITIAL_FLASKS));

// Animatsiya har kadrda o'qiydigan mutable store (React state'dan tashqarida)
const buildLiveState = (flasks) =>
  Object.fromEntries(
    Object.entries(flasks).map(([id, f]) => [
      id,
      { level: f.level, color: f.liquid.color, home: f.position },
    ]),
  );

/**
 * 2-MODUL: 3D Virtual Laboratory sahifasi.
 *
 * Ishlash tartibi:
 *  1. Foydalanuvchi birinchi kolbani bosadi (manba tanlanadi)
 *  2. Ikkinchi kolbani bosadi → quyish animatsiyasi boshlanadi
 *  3. Kimyoviy reaksiya aniqlansa suyuqlik rangi o'zgaradi (CuSO₄ + NaOH → ko'k)
 */
export default function VirtualLab() {
  const [flasks, setFlasks] = useState(deepCopyFlasks);
  const [selectedId, setSelectedId] = useState(null);
  const [pour, setPour] = useState(null); // {from, to}
  const [lastReaction, setLastReaction] = useState(null);
  const liveRef = useRef(buildLiveState(INITIAL_FLASKS));

  const handleFlaskClick = (id) => {
    if (pour) return; // animatsiya paytida bloklanadi

    if (!selectedId) {
      // Bo'sh kolbadan quyib bo'lmaydi
      if (flasks[id].level > 0.01) setSelectedId(id);
      return;
    }
    if (selectedId === id) {
      setSelectedId(null);
      return;
    }
    setPour({ from: selectedId, to: id });
    setSelectedId(null);
  };

  const handlePourComplete = ({ from, to, reaction }) => {
    setFlasks((prev) => {
      const next = { ...prev };
      next[pour.from] = { ...next[pour.from], ...from };
      next[pour.to] = { ...next[pour.to], ...to };
      return next;
    });
    if (reaction) setLastReaction(reaction);
    setPour(null);
  };

  const handleReset = () => {
    if (pour) return;
    setFlasks(deepCopyFlasks());
    liveRef.current = buildLiveState(INITIAL_FLASKS);
    setSelectedId(null);
    setLastReaction(null);
  };

  const hint = pour
    ? '⏳ Suyuqlik quyilmoqda — reaksiyani kuzating...'
    : selectedId
      ? `✅ ${flasks[selectedId].label} tanlandi. Endi suyuqlik quyiladigan kolbani bosing.`
      : '👆 Suyuqlik quymoqchi bo‘lgan kolbangizni bosing. Sahnani sichqoncha bilan aylantirish mumkin.';

  return (
    <div className="flex flex-col h-full">
      {/* Sarlavha va boshqaruv paneli */}
      <header className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-lg">🧪 3D Virtual Laboratoriya — Kimyo</h2>
          <p className="text-sm text-slate-500">{hint}</p>
        </div>
        <button
          onClick={handleReset}
          disabled={!!pour}
          className="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-40 transition-colors"
        >
          🔄 Qayta boshlash
        </button>
      </header>

      {/* 3D sahna */}
      <div className="flex-1 relative min-h-0">
        <LabScene
          flasks={flasks}
          selectedId={selectedId}
          pour={pour}
          liveRef={liveRef}
          onFlaskClick={handleFlaskClick}
          onPourComplete={handlePourComplete}
        />

        {/* Reaksiya natijasi banneri */}
        {lastReaction && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-xl text-center">
            <p className="font-bold">⚗️ {lastReaction.name}</p>
            <p className="text-sm text-blue-100 font-mono mt-0.5">{lastReaction.equation}</p>
          </div>
        )}

        {/* Reagentlar haqida ma'lumot */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-xl shadow p-3 text-xs space-y-1.5">
          <p className="font-bold text-slate-700 text-sm">Reagentlar:</p>
          {Object.values(flasks).map((f) => (
            <p key={f.label} className="flex items-center gap-2 text-slate-600">
              <span
                className="w-3 h-3 rounded-full inline-block border border-slate-300"
                style={{ backgroundColor: f.liquid.color }}
              />
              <b>{f.label}:</b> {f.level > 0.01 ? f.liquid.name : "bo'sh"}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
