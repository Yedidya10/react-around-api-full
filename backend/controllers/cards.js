const Card = require('../models/Card');
const BadRequestError = require('../utils/ErrorHandlers/BadRequestError');
const ForbiddenError = require('../utils/ErrorHandlers/ForbiddenError');
const NotFoundError = require('../utils/ErrorHandlers/NotFoundError');
const ServerError = require('../utils/ErrorHandlers/ServerError');

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId);
    const userId = req.user._id;
    const isOwner = card.owner.toString() === userId;

    if (card == null) {
      throw new NotFoundError('Card not found');
    }
    if (!isOwner) {
      throw new ForbiddenError('Forbidden');
    }
    await Card.findByIdAndDelete(req.params.cardId);
    res.status(200).send({ succeed: 'Card is deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      throw new BadRequestError(err.message);
    } else {
      throw new ServerError('Internal server error');
    }
  }
};

const deleteCardLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true },
    );
    if (card == null) {
      throw new NotFoundError('Card not found');
    }
    res
      .status(200)
      .send({ succeed: `user id ${req.user._id} like was deleted` });
  } catch (err) {
    if (err.name === 'CastError') {
      throw new BadRequestError(err.message);
    } else {
      throw new ServerError('Internal server error');
    }
  }
};

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    throw new ServerError(err.message);
  }
};

const postCard = async (req, res) => {
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
    if (err.name === 'CastError') {
      throw new BadRequestError(err.message);
    } else {
      throw new ServerError('Internal server error');
    }
  }
};

const putCardLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true },
    );
    if (card == null) {
      throw new NotFoundError('Card not found');
    }
    res.status(201).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      throw new BadRequestError(err.message);
    } else if (err.name === 'ValidationError') {
      throw new BadRequestError(err.message);
    } else {
      throw new ServerError('Internal server error');
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
