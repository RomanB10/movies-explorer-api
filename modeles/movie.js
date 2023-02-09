const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');// валидаия URL

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
  director: {
    type: String,
    require: true,
    minlength: 1,
    maxlength: 30,
  },
  duration: {
    type: Number,
    require: true,
    minlength: 2,
    maxlength: 999,
  },
  year: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 2090,
  },
  description: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 999,
  },
  image: {
    type: String,
    require: true,
    validate: {
      validator(v) {
        return isURL(v); // v - значение свойства image
      },
      message: (props) => `${props.value} Некорректный URL`,
    },
  },
  trailerLink: {
    type: String,
    require: true,
    validate: {
      validator(v) {
        return isURL(v); // v - значение свойства trailerLink
      },
      message: (props) => `${props.value} Некорректный URL`,
    },
  },
  thumbnail: {
    type: String,
    require: true,
    validate: {
      validator(v) {
        return isURL(v); // v - значение свойства thumbnail
      },
      message: (props) => `${props.value} Некорректный URL`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    require: true,
    minlength: 1,
    maxlength: 999,
  },
  nameRU: {
    type: String,
    require: true,
    validate: {
      validator(v) {
        return /^[а-яА-ЯёЁ0-9\s]+$/.test(v);
      },
      message: 'некорреткное название, введите название на Русском',
    },
    minlength: 2,
    maxlength: 30,
  },
  nameEN: {
    type: String,
    require: true,
    validate: {
      validator(v) {
        return /^[a-zA-Z0-9\s]+$/.test(v);
      },
      message: 'некорреткное название, введите название на Английском',
    },
    minlength: 2,
    maxlength: 30,
  },
});

// создаем модель и экспортируем ее
module.exports = mongoose.model('movie', movieSchema);
