const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');// валидаия URL

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    require: true,
  },
  director: {
    type: String,
    require: true,
  },
  duration: {
    type: Number,
    require: true,
  },
  year: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
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
 /* movield: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },*/
  nameRU: {
    type: String,
    require: true,
    validate: {
      validator(v) {
        return /^[а-яА-ЯёЁ0-9\s]+$/.test(v);
      },
      message: 'некорреткное название, введите название на Русском',
    },
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
  },
});

// создаем модель и экспортируем ее
module.exports = mongoose.model('movie', movieSchema);