const Card = require('../models/Card');
const BadRequestError = require('../utils/ErrorHandlers/BadRequestError');
const ForbiddenError = require('../utils/ErrorHandlers/ForbiddenError');
const NotFoundError = require('../utils/ErrorHandlers/NotFoundError');
const ServerError = require('../utils/ErrorHandlers/ServerError');

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    const userId = req.user._id;

    if (card == null) {
      return next(new NotFoundError('Card not found'));
    }
    const isOwner = card.owner.toString() === userId;
    if (!isOwner) {
      return next(new ForbiddenError('You can delete only your own cards'));
    }
    await Card.findByIdAndDelete(req.params.cardId);
    res.status(200).send({ succeed: 'Card is deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError(err.message));
    } else {
      return next(new ServerError('Internal server error'));
    }
  }
};

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError(err.message));
    } else {
      return next(new ServerError('Internal server error'));
    }
  }
};

const postCard = async (req, res, next) => {
  try {
    const card = await Card.create({
      name: req.body.name,
      link: req.body.link,
      owner: {
        _id: req.user._id,
      },
    });
    res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(err.message));
    } else {
      return next(new ServerError('Internal server error'));
    }
  }
};

const putCardLike = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      {
        $addToSet: { likes: userId },
      },
      { new: true },
    );
    if (card == null) {
      return next(new NotFoundError('Card not found'));
    }
    res.status(201).send({ succeed: `user id ${req.user._id} like was added`, card });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError(err.message));
    } else if (err.name === 'ValidationError') {
      return next(new BadRequestError(err.message));
    } else {
      return next(new ServerError('Internal server error'));
    }
  }
};

const deleteCardLike = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      {
        $pull: { likes: userId },
      },
      { new: true },
    );
    if (card == null) {
      return next(new NotFoundError('Card not found'));
    }
    res
      .status(200)
      .send({ succeed: `user id ${req.user._id} like was deleted`, card });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError(err.message));
    } else {
      return next(new ServerError('Internal server error'));
    }
  }
};

module.exports = {
  putCardLike,
  postCard,
  getCards,
  deleteCardLike,
  deleteCard,
};
