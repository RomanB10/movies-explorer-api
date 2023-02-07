const express = require('express');// импорт express
const mongoose = require('mongoose');// импорт mongoose
const bodyParser = require('body-parser');// импорт body-parser
const { celebrate, Joi, errors } = require('celebrate');// Валидация приходящих на сервер данных

const cors = require('cors');

const rateLimit = require('express-rate-limit'); // Ограничение количества запросов, защита от Dos-атак
const helmet = require('helmet');// Защита от веб-уязвимостей, настройка Security-заголовков

mongoose.set('strictQuery', false);// чтобы работал dotenv

const { requestLogger, errorLogger } = require('./middlewares/logger');// типорт логеров запросов и ошибок
const auth = require('./middlewares/auth');// импорт мидлвары авторизации
const { createUser, login } = require('./controllers/users');// импорт котроллеров
const NotFoundError = require('./errors/not-found-err');
const CentralHandingError = require('./errors/CentralHandingError');

require('dotenv').config();// необходим, чтобы пользоваться окружением 'process.env'

const { PORT = 3005, MONGO_URL = 'mongodb://localhost:27017/explorerdb' } = process.env;
// создаем сервер
const app = express();
// настройки cors с открытым api
app.use(cors());

// Защита от Dos-атак
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // окно 15 минут
  max: 100, // ограничьте каждый IP-адрес 100 запросами на "окно" (здесь за 15 минут)
  standardHeaders: true, // Возвращает информацию об ограничении скорости в заголовках `RateLimit-*`
  legacyHeaders: false, // Отключите заголовки `X-RateLimit-*`
  message: 'Слишком много запросов с этого IP',
});
// Применить ограничение ко всем запросам, для защиты от DoS-атак.
app.use(limiter);

// Защита всех заголовков, для простановки security-заголовков
app.use(helmet());

app.use(bodyParser.json());// мидлвэра для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));
// мидлвэра для приема веб-страниц внутри POST-запроса
// 'extended: true говорит', что данные в полученном объекте body могут быть любых типов

// подключаемся к серверу mongo
mongoose.connect(MONGO_URL, (err) => {
  if (err) throw err;
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB!!!');
});

app.use(requestLogger); // подключаем логгер запросов

// Краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// роуты, не требующие авторизации, с валидацией тела запроса средствами celebrate
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true), // "unknown(true)" возможность разрешить неизвестные заголовки
}), login);// проверяет переданные в теле почту и пароль и возвращает JWT
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), createUser);// создает пользователя с переданными в теле email, password, name

// роуты, которым авторизация нужна
app.use('/users', auth, require('./routes/users')); // Подключаем роутер пользователей
app.use('/movies', auth, require('./routes/movies')); // Подключаем роутер фильмов

// Мидлвара для обработки неизвестного маршрута
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger); // подключаем логгер ошибок

// обработчик ошибок celebrate, для полного описания ошибки
app.use(errors());

// обработчик всех ошибок
app.use(CentralHandingError);

// Слушаем 3000 порт
app.listen(PORT, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log('Error while starting server');
  } else {
    // eslint-disable-next-line no-console
    console.log('Server has been started at port -', PORT);
  }
});
