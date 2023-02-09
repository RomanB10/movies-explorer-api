const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');// Валидация приходящих на сервер данных
const auth = require('../middlewares/auth');// импорт мидлвары авторизации
const { createUser, login } = require('../controllers/users');// импорт котроллеров
const NotFoundError = require('../errors/not-found-err');

// роуты, не требующие авторизации, с валидацией тела запроса средствами celebrate
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true), // "unknown(true)" возможность разрешить неизвестные заголовки
}), login);// проверяет переданные в теле почту и пароль и возвращает JWT
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), createUser);// создает пользователя с переданными в теле email, password, name

// роуты, которым авторизация нужна
router.use('/users', auth, require('./users')); // Подключаем роутер пользователей
router.use('/movies', auth, require('./movies')); // Подключаем роутер фильмов

// Мидлвара для обработки неизвестного маршрута
router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
