import { useState } from 'react';
import QuizSetup from './QuizSetup.jsx';
import QuizSession from './QuizSession.jsx';
import QuizResults from './QuizResults.jsx';
import { generateQuiz } from '../../api/client.js';

/**
 * 3-MODUL: AI Quiz Generator — holatlar mashinasi:
 * setup (parametrlar) → loading → session (test) → results (natija)
 */
export default function QuizGenerator() {
  const [stage, setStage] = useState('setup');
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]); // foydalanuvchi tanlagan indekslar (null = javobsiz)
  const [error, setError] = useState(null);

  const handleGenerate = async (params) => {
    setStage('loading');
    setError(null);
    try {
      const data = await generateQuiz(params);
      setQuiz(data);
      setStage('session');
    } catch (e) {
      setError(e.message);
      setStage('setup');
    }
  };

  const handleFinish = (userAnswers) => {
    setAnswers(userAnswers);
    setStage('results');
  };

  const handleRestart = () => {
    setQuiz(null);
    setAnswers([]);
    setStage('setup');
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-brand-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <header className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-slate-800">📝 AI Quiz Generator</h2>
          <p className="text-slate-500 mt-1">
            Istalgan mavzu bo'yicha sun'iy intellekt yaratadigan testlar
          </p>
        </header>

        {stage === 'setup' && <QuizSetup onGenerate={handleGenerate} error={error} />}

        {stage === 'loading' && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-5xl animate-bounce mb-4">🤖</div>
            <p className="font-semibold text-slate-700">AI savollarni tayyorlamoqda...</p>
            <p className="text-sm text-slate-400 mt-1">Bu bir necha soniya vaqt olishi mumkin</p>
          </div>
        )}

        {stage === 'session' && quiz && <QuizSession quiz={quiz} onFinish={handleFinish} />}

        {stage === 'results' && quiz && (
          <QuizResults quiz={quiz} answers={answers} onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
}
