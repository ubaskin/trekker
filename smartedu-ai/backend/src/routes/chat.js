import { Router } from 'express';
import { getTeacherReply } from '../services/aiService.js';

const router = Router();

/**
 * POST /api/chat
 * Body: { messages: [{role, content}], lessonTitle?: string }
 * Response: { reply: string }
 */
router.post('/', async (req, res, next) => {
  try {
    const { messages, lessonTitle } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "'messages' bo'sh bo'lmagan massiv bo'lishi shart" });
    }

    // Faqat ruxsat etilgan rollarni qabul qilamiz (prompt injection himoyasi)
    const sanitized = messages
      .filter((m) => ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

    if (sanitized.length === 0) {
      return res.status(400).json({ error: 'Yaroqli xabarlar topilmadi' });
    }

    const reply = await getTeacherReply(sanitized, lessonTitle);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
});

export default router;
