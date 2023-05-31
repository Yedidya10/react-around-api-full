const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { postUser } = require('../controllers/users');

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8).max(30),
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().pattern(
        /^https?:\/\/(www\.)?[\w-]{1,63}\.[\w-]{1,256}[a-z-._~:/?#[\]@!$&'()*+,;=]#?/,
      ),
    }),
  }),
  postUser,
);

module.exports = router;
