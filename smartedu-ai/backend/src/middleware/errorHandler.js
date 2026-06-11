/**
 * Markazlashgan xatolik boshqaruvi.
 * Ichki xatolik tafsilotlarini klientga oshkor qilmaydi — faqat logga yozadi.
 */
export function errorHandler(err, req, res, _next) {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} —`, err.message);

  const status = err.status || 500;
  const message =
    status === 429
      ? "AI xizmati hozir band (rate limit). Birozdan so'ng qayta urinib ko'ring."
      : status === 502
        ? 'AI xizmati bilan bog‘lanishda xatolik yuz berdi.'
        : 'Serverda kutilmagan xatolik yuz berdi.';

  res.status(status).json({ error: message });
}
