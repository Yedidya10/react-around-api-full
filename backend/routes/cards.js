const router = require('express').Router();


const {
  deleteCard,
  deleteCardLike,
  getCards,
  postCard,
  putCardLike,
} = require('../controllers/cards');

router.delete('/:cardId', deleteCard);
router.delete('/:cardId/likes', deleteCardLike);
router.get('/', getCards);
router.post('/', postCard);
router.put('/:cardId/likes', putCardLike);

module.exports = router;
