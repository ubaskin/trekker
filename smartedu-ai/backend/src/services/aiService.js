import { config } from '../config.js';

/**
 * OpenAI Chat Completions API'ga so'rov yuboruvchi yagona quyi-darajali funksiya.
 * SDK o'rniga native fetch ishlatiladi — qo'shimcha dependency talab qilmaydi (Node >= 18).
 */
async function callOpenAI(messages, { jsonMode = false, temperature = 0.7 } = {}) {
  const res = await fetch(`${config.openai.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.openai.apiKey}`,
    },
    body: JSON.stringify({
      model: config.openai.model,
      messages,
      temperature,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`OpenAI API xatosi (${res.status}): ${body}`);
    err.status = res.status === 429 ? 429 : 502;
    throw err;
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

// ─────────────────────────────────────────────────────────────────
// 1-MODUL: AI Teacher
// ─────────────────────────────────────────────────────────────────

const TEACHER_SYSTEM_PROMPT = `Sen "SmartEdu AI" platformasining virtual o'qituvchisisan.
Xarakter va uslubing:
- Mehribon, sabrli va tajribali o'qituvchi kabi muloqot qil. Talabani ismi bilan emas, "do'stim", "azizim" kabi iliq murojaatlar bilan rag'batlantir.
- GUIDED LEARNING: javobni hech qachon birdaniga to'liq berma. Mavzuni bosqichma-bosqich tushuntir:
  1) Avval oddiy hayotiy misol yoki o'xshatish bilan boshla.
  2) Keyin asosiy tushunchani qisqa va aniq yorit.
  3) Oxirida talabani o'ylashga undaydigan 1 ta tekshiruv savoli ber.
- Murakkab atamalarni albatta sodda tilda izohla.
- Javoblarni Markdown formatida yoz: sarlavhalar (##), qalin matn (**), ro'yxatlar, formulalar uchun kod bloklari.
- Talaba qaysi tilda yozsa, o'sha tilda javob ber (asosiy til — o'zbek tili).
- Faqat ta'limga oid mavzularda yordam ber.`;

const MOCK_TEACHER_REPLY = `## Ajoyib savol, do'stim! 🌱

Keling, buni birga bosqichma-bosqich o'rganamiz.

**1-bosqich — Hayotiy o'xshatish:**
Tasavvur qiling, o'simlik — bu kichkina "quyosh oshxonasi". U quyosh nuridan energiya olib, o'ziga "ovqat" tayyorlaydi.

**2-bosqich — Asosiy tushuncha:**
Bu jarayon **fotosintez** deb ataladi. Unda o'simlik:
- ☀️ Quyosh nuri
- 💧 Suv (ildiz orqali)
- 🌫️ Karbonat angidrid (havodan)

...ni olib, **glyukoza** (oziq) va **kislorod** ishlab chiqaradi:

\`\`\`
6CO₂ + 6H₂O + yorug'lik → C₆H₁₂O₆ + 6O₂
\`\`\`

**3-bosqich — Sizga savol:** 🤔
Sizningcha, nima uchun fotosintez faqat o'simlikning **yashil** qismlarida sodir bo'ladi?

> ⚠️ *Bu demo-javob. To'liq AI javoblari uchun backend'da \`OPENAI_API_KEY\` ni sozlang.*`;

/**
 * AI Teacher: chat tarixini qabul qilib, o'qituvchi javobini qaytaradi.
 * @param {Array<{role: 'user'|'assistant', content: string}>} history
 * @param {string} [lessonTitle] - tanlangan dars (kontekst sifatida qo'shiladi)
 */
export async function getTeacherReply(history, lessonTitle) {
  if (config.isMockMode) {
    return MOCK_TEACHER_REPLY;
  }

  const messages = [
    { role: 'system', content: TEACHER_SYSTEM_PROMPT },
    ...(lessonTitle
      ? [{ role: 'system', content: `Hozirgi dars mavzusi: "${lessonTitle}". Javoblaringni shu mavzu kontekstida ber.` }]
      : []),
    // Tarixni oxirgi 20 ta xabar bilan cheklaymiz (token tejash)
    ...history.slice(-20),
  ];

  return callOpenAI(messages, { temperature: 0.8 });
}

// ─────────────────────────────────────────────────────────────────
// 3-MODUL: AI Quiz Generator
// ─────────────────────────────────────────────────────────────────

const MOCK_QUIZ = {
  topic: 'Fotosintez',
  questions: [
    {
      id: 1,
      question: 'Fotosintez jarayoni o‘simlikning qaysi organoidida sodir bo‘ladi?',
      options: ['Mitoxondriya', 'Xloroplast', 'Ribosoma', 'Yadro'],
      correctIndex: 1,
      explanation: 'Xloroplast tarkibidagi xlorofill pigmenti yorug‘lik energiyasini yutadi.',
    },
    {
      id: 2,
      question: 'Fotosintez natijasida atmosferaga qaysi gaz ajralib chiqadi?',
      options: ['Karbonat angidrid', 'Azot', 'Kislorod', 'Vodorod'],
      correctIndex: 2,
      explanation: 'Suv molekulalari parchalanishi natijasida kislorod (O₂) ajralib chiqadi.',
    },
    {
      id: 3,
      question: 'Fotosintez uchun quyidagilardan qaysi biri SHART EMAS?',
      options: ['Yorug‘lik', 'Suv', 'Kislorod', 'Karbonat angidrid'],
      correctIndex: 2,
      explanation: 'Kislorod fotosintezning mahsuloti, dastlabki sharti emas.',
    },
    {
      id: 4,
      question: 'Fotosintezning yorug‘lik bosqichi qayerda kechadi?',
      options: ['Stromada', 'Tilakoid membranalarida', 'Sitoplazmada', 'Hujayra devorida'],
      correctIndex: 1,
      explanation: 'Yorug‘lik reaksiyalari tilakoid membranalarida amalga oshadi.',
    },
    {
      id: 5,
      question: 'Fotosintez natijasida hosil bo‘ladigan asosiy organik modda?',
      options: ['Oqsil', 'Glyukoza', 'Yog‘', 'Vitamin'],
      correctIndex: 1,
      explanation: 'C₆H₁₂O₆ — glyukoza fotosintezning asosiy mahsulotidir.',
    },
  ],
};

/**
 * Quiz JSON tuzilishini qat'iy tekshiradi — AI noto'g'ri format qaytarsa xato beramiz.
 */
function validateQuiz(quiz, expectedCount) {
  if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    throw new Error('AI yaroqsiz quiz formatini qaytardi');
  }
  quiz.questions = quiz.questions.slice(0, expectedCount).map((q, i) => {
    if (
      typeof q.question !== 'string' ||
      !Array.isArray(q.options) ||
      q.options.length !== 4 ||
      !Number.isInteger(q.correctIndex) ||
      q.correctIndex < 0 ||
      q.correctIndex > 3
    ) {
      throw new Error(`${i + 1}-savol formati yaroqsiz`);
    }
    return { ...q, id: i + 1, explanation: q.explanation || '' };
  });
  return quiz;
}

/**
 * AI Quiz Generator: mavzu, savollar soni va qiyinchilik bo'yicha test yaratadi.
 *
 * ⚠️ MVP eslatmasi: to'g'ri javoblar (correctIndex) klientga yuboriladi va ball
 * klientda hisoblanadi. Production'da javoblarni server sessiyasida saqlab,
 * tekshiruvni alohida endpoint orqali qilish tavsiya etiladi.
 */
export async function generateQuiz({ topic, count, difficulty }) {
  if (config.isMockMode) {
    return { ...MOCK_QUIZ, topic, questions: MOCK_QUIZ.questions.slice(0, count) };
  }

  const prompt = `Quyidagi parametrlar asosida test savollari yarat:
- Mavzu: ${topic}
- Savollar soni: ${count}
- Qiyinchilik darajasi: ${difficulty}
- Til: o'zbek tili

Qat'iy JSON formatida qaytar (boshqa hech qanday matn yozma):
{
  "topic": "mavzu nomi",
  "questions": [
    {
      "id": 1,
      "question": "savol matni",
      "options": ["A variant", "B variant", "C variant", "D variant"],
      "correctIndex": 0,
      "explanation": "to'g'ri javobning qisqa izohi"
    }
  ]
}

Qoidalar:
- Har bir savolda aniq 4 ta variant bo'lsin.
- correctIndex — to'g'ri variantning indeksi (0-3), savollar bo'ylab tasodifiy taqsimlansin.
- Savollar bir-birini takrorlamasin va "${difficulty}" darajaga mos bo'lsin.`;

  const raw = await callOpenAI(
    [
      { role: 'system', content: 'Sen tajribali metodist-o\'qituvchisan. Faqat valid JSON qaytarasan.' },
      { role: 'user', content: prompt },
    ],
    { jsonMode: true, temperature: 0.9 },
  );

  return validateQuiz(JSON.parse(raw), count);
}
