const router = require('express').Router();
const { getCurrentUser, updateProfile } = require('../controllers/users');// импорт контроллеров
const { customerPatchValidator } = require('../middlewares/customerValidator');// импорт мидлвары с celebrate

// eslint-disable-next-line max-len
// сработает при GET-запросе на URL '/users/me' - получить информацию о текущем пользователе (email и имя)
router.get('/me', getCurrentUser);

// сработает при PATCH-запросе на URL '/users/me' - обновляет профиль(email и имя)
router.patch('/me', customerPatchValidator, updateProfile);

module.exports = router;
