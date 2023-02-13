const { celebrate, Joi } = require('celebrate'); // Валидация приходящих на сервер данных
const isURL = require('validator/lib/isURL');// валидация URL
Joi.objectId = require('joi-objectid')(Joi); // Пакет для валидации id

// валидация при POST-запросе на URL '/movies' - добавляет фильм
const customerCreateValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(1).max(30),
    duration: Joi.number().required().min(2).max(999),
    year: Joi.number().required().min(2).max(2090),
    description: Joi.string().required().min(2).max(999),
    image: Joi.string().required()
      .custom((value, helpers) => {
        if (isURL(value)) {
          return value;
        }
        return helpers.message('Введен некорректный URL');
      }), // кастомная валидация
    trailerLink: Joi.string().required()
      .custom((value, helpers) => {
        if (isURL(value)) {
          return value;
        }
        return helpers.message('Введен некорректный URL');
      }), // кастомная валидация,
    thumbnail: Joi.string().required()
      .custom((value, helpers) => {
        if (isURL(value)) {
          return value;
        }
        return helpers.message('Введен некорректный URL');
      }), // кастомная валидация,
    movieId: Joi.number().required().min(1).max(999),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
  }),
});

// валидация при DELETE-запросе на URL '/movies/:_id' - удаляет карточку по идентификатору
const customerDeleteValidator = celebrate({
  params: Joi.object().keys({
    _id: Joi.objectId(), // валидация с помощью пакета "joi-objectId"
  }),
});

// валидация при PATCH-запросе на URL '/users/me' - обновляет профиль(email и имя)
const customerPatchValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

// валидация при POST-запросе на URL '/signin'
const customerPostSigninValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true), // "unknown(true)" возможность разрешить неизвестные заголовки
});

// валидация при POST-запросе на URL '/signup'
const customerPostSignupValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
});

module.exports = {
  customerCreateValidator,
  customerDeleteValidator,
  customerPatchValidator,
  customerPostSigninValidator,
  customerPostSignupValidator,
};
