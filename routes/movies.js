const router = require('express').Router();

// сработает при GET-запросе на URL '/movies' - возвращает все сохраненные текущим пользователем фильмы
router.get('/', getMovies);

// сработает при POST-запросе на URL '/movies' - добавляет фильм
router.post('/', createMovies);

// сработает при DELETE-запросе на URL '/movies/:_id' - удаляет карточку по идентификатору
router.delete('/:cardId', deleteMovies);

module.exports = router;