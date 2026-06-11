import { Router } from 'express';
import { generateQuiz } from '../services/aiService.js';

const router = Router();

const DIFFICULTIES = ['Oson', "O'rta", 'Qiyin'];

/**
 * POST /api/quiz
 * Body: { topic: string, count: number (1-10), difficulty: 'Oson'|"O'rta"|'Qiyin' }
 * Response: { topic, questions: [{id, question, options[4], correctIndex, explanation}] }
 */
router.post('/', async (req, res, next) => {
  try {
    const { topic, count, difficulty } = req.body;

    if (typeof topic !== 'string' || topic.trim().length < 2 || topic.length > 200) {
      return res.status(400).json({ error: "'topic' 2-200 belgidan iborat bo'lishi kerak" });
    }
    const n = Number(count);
    if (!Number.isInteger(n) || n < 1 || n > 10) {
      return res.status(400).json({ error: "'count' 1 dan 10 gacha butun son bo'lishi kerak" });
    }
    if (!DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({ error: `'difficulty' quyidagilardan biri bo'lishi kerak: ${DIFFICULTIES.join(', ')}` });
    }

    const quiz = await generateQuiz({ topic: topic.trim(), count: n, difficulty });
    res.json(quiz);
  } catch (err) {
    next(err);
  }
});

export default router;
