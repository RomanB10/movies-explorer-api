require('dotenv').config();// необходим, чтобы пользоваться окружением 'process.env'

const { JWT_SECRET_KEY = 'verty_secret' } = process.env;
const BAD_REQUSET = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;
const OK = 200;
const CREATED = 201;

const ERROR_400 = 'Переданы некорректные данные';
const ERROR_401 = 'Необходима авторизация';
const ERROR_403 = 'Нельзя удалить чужие карточки';
const ERROR_404 = 'Передан несуществующий _id';
const ERROR_500 = 'На сервере произошла ошибка';
const ERROR_409 = 'Такой пользователь уже существует';

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SOLT_ROUNDS = 10;

module.exports = {
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
  BAD_REQUSET,
  NOT_FOUND,
  SERVER_ERROR,
  OK,
  CREATED,
  ERROR_400,
  ERROR_401,
  ERROR_403,
  ERROR_404,
  ERROR_409,
  ERROR_500,
  MONGO_DUPLICATE_ERROR_CODE,
  SOLT_ROUNDS,
  JWT_SECRET_KEY,
};
