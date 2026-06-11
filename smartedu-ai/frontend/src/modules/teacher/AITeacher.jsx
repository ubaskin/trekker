import { useEffect, useRef, useState } from 'react';
import LessonList, { LESSONS } from './LessonList.jsx';
import ChatMessage from './ChatMessage.jsx';
import ChatInput from './ChatInput.jsx';
import { sendChatMessage } from '../../api/client.js';

function welcomeMessage(lesson) {
  return {
    role: 'assistant',
    content: `## Assalomu alaykum, do'stim! 👋\n\nMen sizning virtual o'qituvchingizman. Bugun **"${lesson.title}"** mavzusini birga o'rganamiz.\n\nXohlagan savolingizni bering — men sizga bosqichma-bosqich, sodda misollar bilan tushuntirib beraman. Boshlaymizmi? 🚀`,
  };
}

/**
 * 1-MODUL: AI Teacher — chap tomonda darslar ro'yxati, markazda chat interfeysi.
 * Har bir dars uchun alohida chat tarixi saqlanadi.
 */
export default function AITeacher() {
  const [activeLessonId, setActiveLessonId] = useState(LESSONS[0].id);
  const [histories, setHistories] = useState(() =>
    Object.fromEntries(LESSONS.map((l) => [l.id, [welcomeMessage(l)]])),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const activeLesson = LESSONS.find((l) => l.id === activeLessonId);
  const messages = histories[activeLessonId];

  // Yangi xabar kelganda pastga avtomatik aylantirish
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const appendMessage = (lessonId, msg) => {
    setHistories((prev) => ({ ...prev, [lessonId]: [...prev[lessonId], msg] }));
  };

  const handleSend = async (text) => {
    if (isLoading) return;
    setError(null);

    const userMsg = { role: 'user', content: text };
    const nextHistory = [...messages, userMsg];
    appendMessage(activeLessonId, userMsg);
    setIsLoading(true);

    try {
      // Welcome xabarini API'ga yubormaymiz — faqat haqiqiy dialog
      const reply = await sendChatMessage(nextHistory.slice(1), activeLesson.title);
      appendMessage(activeLessonId, { role: 'assistant', content: reply });
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      <LessonList activeId={activeLessonId} onSelect={setActiveLessonId} />

      <section className="flex-1 min-w-0 flex flex-col bg-slate-50">
        {/* Chat sarlavhasi */}
        <header className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-3">
          <span className="text-2xl">{activeLesson.icon}</span>
          <div>
            <h2 className="font-bold">{activeLesson.title}</h2>
            <p className="text-xs text-slate-500">{activeLesson.subject} · AI Teacher bilan jonli muloqot</p>
          </div>
        </header>

        {/* Xabarlar oqimi */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-sm pl-12">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="ml-1">O'qituvchi yozmoqda...</span>
            </div>
          )}

          {error && (
            <div className="mx-12 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              ⚠️ {error}
            </div>
          )}
        </div>

        <ChatInput onSend={handleSend} disabled={isLoading} />
      </section>
    </div>
  );
}
