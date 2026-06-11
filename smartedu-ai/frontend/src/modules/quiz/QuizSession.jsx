import { useEffect, useRef, useState } from 'react';

const SECONDS_PER_QUESTION = 30;

function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Test topshirish jarayoni: savollar, variantlar, taymer va progress.
 * Vaqt tugasa test avtomatik yakunlanadi.
 */
export default function QuizSession({ quiz, onFinish }) {
  const total = quiz.questions.length;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(() => Array(total).fill(null));
  const [timeLeft, setTimeLeft] = useState(total * SECONDS_PER_QUESTION);

  // onFinish'ni har doim eng so'nggi answers bilan chaqirish uchun ref
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const finishedRef = useRef(false);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish(answersRef.current);
  };

  // Taymer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          finish();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const question = quiz.questions[current];
  const isLast = current === total - 1;
  const timeDanger = timeLeft <= 30;

  const selectOption = (optionIndex) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = optionIndex;
      return next;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Yuqori panel: progress + taymer */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Mavzu: <b className="text-slate-700">{quiz.topic}</b>
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Savol {current + 1} / {total}
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-xl font-mono font-bold text-lg ${
            timeDanger ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-brand-50 text-brand-700'
          }`}
        >
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress chizig'i */}
      <div className="h-1.5 bg-slate-100">
        <div
          className="h-full bg-brand-500 transition-all duration-300"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      {/* Savol */}
      <div className="p-7">
        <h3 className="text-lg font-bold text-slate-800 leading-snug">{question.question}</h3>

        <div className="mt-5 space-y-3">
          {question.options.map((option, i) => {
            const isSelected = answers[current] === i;
            return (
              <button
                key={i}
                onClick={() => selectOption(i)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-colors ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 text-brand-900'
                    : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold text-sm ${
                    isSelected ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Navigatsiya */}
        <div className="flex items-center justify-between mt-7">
          <button
            onClick={() => setCurrent((c) => c - 1)}
            disabled={current === 0}
            className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 disabled:opacity-40 transition-colors"
          >
            ← Oldingi
          </button>

          {/* Savollar bo'ylab tezkor o'tish nuqtalari */}
          <div className="flex gap-1.5">
            {quiz.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === current
                    ? 'bg-brand-500 scale-125'
                    : answers[i] !== null
                      ? 'bg-brand-300'
                      : 'bg-slate-300'
                }`}
                aria-label={`${i + 1}-savol`}
              />
            ))}
          </div>

          {isLast ? (
            <button
              onClick={finish}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
            >
              ✓ Yakunlash
            </button>
          ) : (
            <button
              onClick={() => setCurrent((c) => c + 1)}
              className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors"
            >
              Keyingi →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
