const bcrypt = require('bcryptjs'); // используем модуль для хеширования пароля
const jwt = require('jsonwebtoken'); // используем модуль веб-токена
const User = require('../modeles/user'); // импорт моделе с соответствующей схемой

const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');

const {
  CREATED,
  ERROR_400,
  ERROR_404,
  MONGO_DUPLICATE_ERROR_CODE,
  SOLT_ROUNDS,
  JWT_SECRET_KEY,
} = require('../constants');

// сработает при GET-запросе на URL '/users/me' - получить информацию о текущем пользователе (email и имя)
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_404);
      }
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ERROR_400));
      } else {
        next(err);
      }
    });
};

// сработает при POST-запросе на URL '/signup' - добавляет пользователя
module.exports.createUser = async (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return res.status(400).send({ message: 'Не переданы email или password' });
  }

  try {
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);// хешируем пароль
    // создаем пользователя с захешированным паролем
    const newUser = await User.create({
      name,
      email,
      password: hash,
    });
    if (newUser) {
      return res.status(CREATED).send({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password, // потом надо убрать
        id: newUser._id,
      });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Не валидные email или pasword'));
    } else if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
      next(new ConflictError('Такой пользователь уже существует'));
    } else {
      next(error);
    }
  }
};

// сработает при POST-запросе на URL '/signin', аутентификация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new UnauthorizedError('Не правильные email или pasword');
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна
      // создаем токен
      const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, {
        expiresIn: '7d',
      });
      // вернём токен
      res.status(200).send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Не правильные email или pasword'));
    });
};

// сработает при PATCH-запросе на URL '/users/me' - обновляет профиль
module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  console.log(req.body)
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_404);
      }
      res.send({
        name: user.name,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_400));
      } else {
        next(err);
      }
    });
};