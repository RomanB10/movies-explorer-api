const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { ERROR_401, JWT_SECRET_KEY } = require('../constants');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
 /* console.log('req.headers',req.headers)*/
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(ERROR_401);
  }

  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // верифицируем токен
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    if (err.statusCode === 401 || err.name === 'JsonWebTokenError') {
      next(new UnauthorizedError(ERROR_401));
    } else {
      next(err);
    }
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
