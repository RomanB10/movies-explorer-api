const express = require('express');// импорт express
const mongoose = require('mongoose');// импорт mongoose
const bodyParser = require('body-parser');// импорт body-parser

const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/explorerdb' } = process.env;
// создаем сервер
const app = express();

app.use(bodyParser.json());// мидлвэра для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));
// мидлвэра для приема веб-страниц внутри POST-запроса
// 'extended: true говорит', что данные в полученном объекте body могут быть любых типов

// подключаемся к серверу mongo
mongoose.connect(MONGO_URL, (err) => {
  if (err) throw err;
  console.log('Connected to MongoDB!!!');
});

// роуты, не требующие авторизации, с валидацией тела запроса средствами celebrate
app.post('/signin', login);// проверяет переданные в теле почту и пароль и возвращает JWT
app.post('/signup', createUser);// создает пользователя с переданными в теле email, password, name

// роуты, которым авторизация нужна
app.use('/users', auth, require('./routes/users')); // Подключаем роутер пользователей
/*app.use('/movies', auth, require('./routes/movies')); // Подключаем роутер фильмов*/

// Мидлвара для обработки неизвестного маршрута
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

// Слушаем 3000 порт
app.listen(PORT, (err) => {
  if (err) {
    console.log('Error while starting server');
  } else {
    console.log('Server has been started at port -', PORT);
  }
});