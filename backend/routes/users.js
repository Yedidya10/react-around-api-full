const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const validate = require('../utils/validator');

const {
  getUsers,
  getUserById,
  getUserInfo,
  patchUserAvatar,
  patchUserProfile,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:id', getUserById);
router.get('/me', getUserInfo);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      username: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  patchUserProfile,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validate),
    }),
  }),
  patchUserAvatar,
);

module.exports = router;
