/**
 * Backend API bilan bog'lanish funksiyalari.
 * Dev rejimda Vite proxy '/api' so'rovlarini backendga yo'naltiradi.
 */
const BASE_URL = import.meta.env.VITE_API_URL || '';

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `So'rov muvaffaqiyatsiz tugadi (${res.status})`);
  }
  return data;
}

/**
 * 1-MODUL: AI Teacher — chat tarixini yuborib, o'qituvchi javobini oladi.
 * @returns {Promise<string>} Markdown formatidagi javob
 */
export async function sendChatMessage(messages, lessonTitle) {
  const { reply } = await post('/api/chat', { messages, lessonTitle });
  return reply;
}

/**
 * 3-MODUL: Quiz Generator — AI'dan test savollarini oladi.
 * @returns {Promise<{topic: string, questions: Array}>}
 */
export async function generateQuiz({ topic, count, difficulty }) {
  return post('/api/quiz', { topic, count, difficulty });
}
