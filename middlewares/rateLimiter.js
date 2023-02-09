const rateLimit = require('express-rate-limit'); // Ограничение количества запросов, защита от Dos-атак

// Защита от Dos-атак
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // окно 15 минут
  max: 100, // ограничьте каждый IP-адрес 100 запросами на "окно" (здесь за 15 минут)
  standardHeaders: true, // Возвращает информацию об ограничении скорости в заголовках `RateLimit-*`
  legacyHeaders: false, // Отключите заголовки `X-RateLimit-*`
  message: 'Слишком много запросов с этого IP',
});

module.exports = limiter;
