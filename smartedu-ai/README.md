# 🎓 SmartEdu AI — Innovatsion Ta'lim Platformasi (MVP)

SmartEdu AI — sun'iy intellekt asosidagi zamonaviy ta'lim platformasi. MVP versiyasi 3 ta asosiy moduldan iborat:

| Modul | Tavsif | Texnologiya |
|---|---|---|
| 🧑‍🏫 **AI Teacher** | Bosqichma-bosqich (Guided Learning) tushuntiruvchi virtual o'qituvchi chati | React + Markdown + OpenAI GPT-4o |
| 🧪 **3D Virtual Laboratory** | Brauzerda ishlaydigan interaktiv kimyo laboratoriyasi | React Three Fiber (Three.js) |
| 📝 **AI Quiz Generator** | Istalgan mavzu bo'yicha AI yaratadigan testlar, taymer va natijalar paneli | React + OpenAI (JSON mode) |

---

## 📁 Fayllar tuzilishi (File Structure)

```
smartedu-ai/
├── backend/                        # Node.js (Express) API server
│   ├── package.json
│   ├── .env.example                # API kalitlari namunasi
│   └── src/
│       ├── server.js               # Express server (entry point)
│       ├── config.js               # Konfiguratsiya (env o'qish)
│       ├── middleware/
│       │   └── errorHandler.js     # Markazlashgan xatolik boshqaruvi
│       ├── services/
│       │   └── aiService.js        # OpenAI integratsiyasi (chat + quiz)
│       └── routes/
│           ├── chat.js             # POST /api/chat   → AI Teacher
│           └── quiz.js             # POST /api/quiz   → Quiz Generator
│
└── frontend/                       # React (Vite) + Tailwind CSS
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx                # Entry point
        ├── App.jsx                 # Router + asosiy layout
        ├── index.css               # Tailwind + global stillar
        ├── api/
        │   └── client.js           # Backend bilan bog'lanish funksiyalari
        ├── components/
        │   └── Sidebar.jsx         # Modullar navigatsiyasi
        └── modules/
            ├── teacher/            # 1-MODUL: AI Teacher
            │   ├── AITeacher.jsx   # Asosiy sahifa (darslar + chat)
            │   ├── LessonList.jsx  # Chap paneldagi darslar ro'yxati
            │   ├── ChatMessage.jsx # Markdown'li xabar komponenti
            │   └── ChatInput.jsx   # Xabar yozish maydoni
            ├── lab/                # 2-MODUL: 3D Virtual Laboratory
            │   ├── VirtualLab.jsx  # Sahifa + boshqaruv paneli
            │   ├── LabScene.jsx    # 3D sahna (stol, yorug'lik, kamera)
            │   ├── Flask.jsx       # Kolba + suyuqlik + quyish animatsiyasi
            │   └── chemistry.js    # Reaksiyalar ma'lumotlar bazasi
            └── quiz/               # 3-MODUL: AI Quiz Generator
                ├── QuizGenerator.jsx # Asosiy sahifa (holatlar mashinasi)
                ├── QuizSetup.jsx     # Mavzu/son/qiyinchilik formasi
                ├── QuizSession.jsx   # Test topshirish + taymer
                └── QuizResults.jsx   # Yakuniy ball va tahlil paneli
```

---

## 🚀 Ishga tushirish

### 1. Backend

```bash
cd smartedu-ai/backend
cp .env.example .env        # OPENAI_API_KEY ni kiriting
npm install
npm run dev                 # http://localhost:5050
```

> **Eslatma:** `OPENAI_API_KEY` kiritilmasa, server **demo (mock) rejimda** ishlaydi —
> platformani API kalitisiz ham to'liq sinab ko'rish mumkin.

### 2. Frontend

```bash
cd smartedu-ai/frontend
npm install
npm run dev                 # http://localhost:5173
```

---

## 🏗 Tizim arxitekturasi

```
┌──────────────────────────────────────────────────────────┐
│                     FOYDALANUVCHI (Brauzer)               │
└───────────────┬──────────────────────────────────────────┘
                │ HTTPS
┌───────────────▼──────────────────────────────────────────┐
│  FRONTEND — React (Vite) + Tailwind CSS                  │
│  ├─ AI Teacher (react-markdown)                          │
│  ├─ 3D Lab (React Three Fiber — to'liq klient tomonda)   │
│  └─ Quiz (taymer, natijalar — klient tomonda hisoblanadi)│
└───────────────┬──────────────────────────────────────────┘
                │ REST API (JSON)
┌───────────────▼──────────────────────────────────────────┐
│  BACKEND — Node.js / Express                             │
│  ├─ POST /api/chat  → o'qituvchi system-prompt + tarix   │
│  ├─ POST /api/quiz  → JSON-mode bilan test generatsiyasi │
│  └─ Xavfsizlik: API kalit faqat serverda, CORS, validatsiya │
└───────────────┬──────────────────────────────────────────┘
                │
┌───────────────▼──────────────────────────────────────────┐
│  OpenAI API (GPT-4o / GPT-4o-mini)                       │
└──────────────────────────────────────────────────────────┘
```

### Asosiy arxitektura qarorlari

1. **API kaliti faqat backendda** — frontend hech qachon OpenAI bilan to'g'ridan-to'g'ri gaplashmaydi (xavfsizlik).
2. **Mock-rejim** — kalitsiz ham demo ishlaydi, bu CI/CD va prezentatsiyalar uchun qulay.
3. **JSON mode** — quiz generatsiyasida `response_format: json_object` ishlatiladi, natija har doim valid JSON bo'ladi va serverda qo'shimcha validatsiyadan o'tadi.
4. **To'g'ri javoblar serverda emas, klientda tekshiriladi** — MVP uchun soddalik; production'da javoblarni serverda saqlash tavsiya etiladi (kodda izoh sifatida belgilangan).
5. **3D laboratoriya to'liq klient tomonda** — backend talab qilmaydi, reaksiyalar `chemistry.js` ma'lumotlar bazasidan olinadi.
