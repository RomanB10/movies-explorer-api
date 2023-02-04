const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // Валидация приходящих на сервер данных
const { getCurrentUser, updateProfile } = require('../controllers/users');// импорт контроллеров

// сработает при GET-запросе на URL '/users/me' - получить информацию о текущем пользователе (email и имя)
router.get('/me', getCurrentUser);

// сработает при PATCH-запросе на URL '/users/me' - обновляет профиль(email и имя)
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateProfile);

module.exports = router;