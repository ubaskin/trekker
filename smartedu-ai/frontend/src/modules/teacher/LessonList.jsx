// MVP uchun statik darslar ro'yxati. Production'da backend/DB'dan olinadi.
export const LESSONS = [
  { id: 'photosynthesis', title: 'Fotosintez', subject: 'Biologiya', icon: '🌱' },
  { id: 'newton-laws', title: 'Nyuton qonunlari', subject: 'Fizika', icon: '🍎' },
  { id: 'chemical-reactions', title: 'Kimyoviy reaksiyalar', subject: 'Kimyo', icon: '⚗️' },
  { id: 'quadratic-equations', title: 'Kvadrat tenglamalar', subject: 'Matematika', icon: '📐' },
  { id: 'world-war-2', title: "Ikkinchi jahon urushi", subject: 'Tarix', icon: '🌍' },
  { id: 'cell-biology', title: 'Hujayra tuzilishi', subject: 'Biologiya', icon: '🔬' },
];

/**
 * Chap paneldagi darslar ro'yxati — tanlangan dars chat kontekstini belgilaydi.
 */
export default function LessonList({ activeId, onSelect }) {
  return (
    <aside className="w-72 shrink-0 bg-white border-r border-slate-200 flex flex-col">
      <div className="px-5 py-4 border-b border-slate-200">
        <h3 className="font-bold text-slate-700">📚 Darslar</h3>
        <p className="text-xs text-slate-400 mt-0.5">Mavzuni tanlang va savol bering</p>
      </div>

      <ul className="flex-1 overflow-y-auto p-3 space-y-1">
        {LESSONS.map((lesson) => (
          <li key={lesson.id}>
            <button
              onClick={() => onSelect(lesson.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeId === lesson.id
                  ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-500/30'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <span className="text-xl">{lesson.icon}</span>
              <span className="min-w-0">
                <span className="block font-medium truncate">{lesson.title}</span>
                <span className="block text-xs text-slate-400">{lesson.subject}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
