const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // Валидация приходящих на сервер данных
const isURL = require('validator/lib/isURL');// валидация URL
const { getMovies, createMovies, deleteMovies } = require('../controllers/movies'); // импорт контроллеров
Joi.objectId = require('joi-objectid')(Joi); // Пакет для валидации id

// сработает при GET-запросе на URL '/movies' - возвращает все фильмы
router.get('/', getMovies);

// сработает при POST-запросе на URL '/movies' - добавляет фильм
router.post('/', celebrate({
  body: Joi.object().keys({
    /*movield: Joi.number().required().min(1).max(999),*/
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
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
  }),
}), createMovies);

// сработает при DELETE-запросе на URL '/movies/:_id' - удаляет карточку по идентификатору
router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.objectId(), // валидация с помощью пакета "joi-objectId"
  }),
}), deleteMovies);

module.exports = router;
