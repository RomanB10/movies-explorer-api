const router = require('express').Router();
const { getCurrentUser, updateProfile } = require('../controllers/users');

// сработает при GET-запросе на URL '/users/me' - получить информацию о текущем пользователе (email и имя)
router.get('/me', getCurrentUser);

// сработает при PATCH-запросе на URL '/users/me' - обновляет профиль(email и имя)
router.patch('/me', updateProfile);

module.exports = router;