const router = require('express').Router();
const { getMovies, createMovies, deleteMovies } = require('../controllers/movies'); // импорт контроллеров
const { customerCreateValidator, customerDeleteValidator } = require('../middlewares/customerValidator');// импорт мидлвары с celebrate

// сработает при GET-запросе на URL '/movies' - возвращает все фильмы
router.get('/', getMovies);

// сработает при POST-запросе на URL '/movies' - добавляет фильм
router.post('/', customerCreateValidator, createMovies);

// сработает при DELETE-запросе на URL '/movies/:_id' - удаляет карточку по идентификатору
router.delete('/:_id', customerDeleteValidator, deleteMovies);

module.exports = router;
