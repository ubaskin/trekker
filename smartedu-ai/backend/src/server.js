import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import chatRouter from './routes/chat.js';
import quizRouter from './routes/quiz.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: config.clientOrigin }));
app.use(express.json({ limit: '200kb' }));

// Health check (monitoring/deploy uchun)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', mode: config.isMockMode ? 'demo' : 'live', model: config.openai.model });
});

app.use('/api/chat', chatRouter);
app.use('/api/quiz', quizRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🎓 SmartEdu AI backend → http://localhost:${config.port}`);
  if (config.isMockMode) {
    console.log("⚠️  OPENAI_API_KEY topilmadi — server DEMO rejimda ishlamoqda.");
  }
});
