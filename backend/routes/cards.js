const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validate = require('../utils/validator');

const {
  deleteCard,
  deleteCardLike,
  getCards,
  postCard,
  putCardLike,
} = require('../controllers/cards');

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteCard
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteCardLike
);

router.get('/', getCards);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(validate),
    }),
  }),
  postCard
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  putCardLike
);

module.exports = router;
