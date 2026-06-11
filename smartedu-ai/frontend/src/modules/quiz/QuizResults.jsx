/**
 * Natijalar paneli: yakuniy ball, baho va har bir savol bo'yicha tahlil.
 */
export default function QuizResults({ quiz, answers, onRestart }) {
  const total = quiz.questions.length;
  const correct = quiz.questions.filter((q, i) => answers[i] === q.correctIndex).length;
  const percent = Math.round((correct / total) * 100);

  const grade =
    percent >= 90
      ? { emoji: '🏆', text: "A'lo natija!", color: 'text-emerald-600' }
      : percent >= 70
        ? { emoji: '🎉', text: 'Yaxshi natija!', color: 'text-brand-600' }
        : percent >= 50
          ? { emoji: '💪', text: "Yomon emas, yana mashq qiling!", color: 'text-amber-600' }
          : { emoji: '📖', text: "Mavzuni qayta o'rganish tavsiya etiladi", color: 'text-red-500' };

  return (
    <div className="space-y-5">
      {/* Umumiy natija kartasi */}
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-3">{grade.emoji}</div>
        <h3 className={`text-2xl font-extrabold ${grade.color}`}>{grade.text}</h3>
        <p className="text-slate-500 mt-1">
          Mavzu: <b>{quiz.topic}</b>
        </p>

        <div className="flex items-center justify-center gap-8 mt-6">
          <div>
            <p className="text-4xl font-extrabold text-slate-800">
              {correct}<span className="text-xl text-slate-400">/{total}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">To'g'ri javoblar</p>
          </div>
          <div className="w-px h-12 bg-slate-200" />
          <div>
            <p className="text-4xl font-extrabold text-brand-600">{percent}%</p>
            <p className="text-xs text-slate-400 mt-1">Yakuniy ball</p>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="mt-7 px-8 py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors"
        >
          🔄 Yangi test yaratish
        </button>
      </div>

      {/* Savollar bo'yicha batafsil tahlil */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h4 className="font-bold text-slate-700">📊 Batafsil tahlil</h4>

        {quiz.questions.map((q, i) => {
          const userAnswer = answers[i];
          const isCorrect = userAnswer === q.correctIndex;
          const skipped = userAnswer === null;

          return (
            <div
              key={q.id}
              className={`p-4 rounded-xl border ${
                isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <p className="font-semibold text-slate-800">
                {isCorrect ? '✅' : skipped ? '⏭️' : '❌'} {i + 1}. {q.question}
              </p>

              <div className="mt-2 text-sm space-y-1">
                {!isCorrect && !skipped && (
                  <p className="text-red-600">
                    Sizning javobingiz: <b>{q.options[userAnswer]}</b>
                  </p>
                )}
                {skipped && <p className="text-slate-500 italic">Javob belgilanmagan</p>}
                <p className="text-emerald-700">
                  To'g'ri javob: <b>{q.options[q.correctIndex]}</b>
                </p>
                {q.explanation && (
                  <p className="text-slate-500 mt-1.5 pt-1.5 border-t border-slate-200/70">
                    💡 {q.explanation}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
