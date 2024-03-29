const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login } = require('../controllers/users');

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8).max(30),
    }),
  }),
  login,
);

module.exports = router;
