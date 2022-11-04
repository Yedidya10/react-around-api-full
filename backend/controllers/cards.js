const Card = require('../models/Card');
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_CODE,
} = require('../utils/errorCodes');

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (card == null) {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: 'card not found!' });
    }
    res.status(200).send({ succeed: 'Card is deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: err.message });
    } else {
      res.status(SERVER_ERROR_CODE).send({ message: err.message });
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
      res.status(NOT_FOUND_ERROR_CODE).send({ message: 'card not found!' });
    }
    res
      .status(200)
      .send({ succeed: `user id ${req.user._id} like was deleted` });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: err.message });
    } else {
      res.status(SERVER_ERROR_CODE).send({ message: err.message });
    }
  }
};

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send({ message: err.message });
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
      res
        .status(BAD_REQUEST_ERROR_CODE)
        .send({ message: `${err.name} - ${err.message}` });
    } else {
      res.status(SERVER_ERROR_CODE).send({ message: err.message });
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
      res.status(NOT_FOUND_ERROR_CODE).send({ message: 'card not found!' });
    }
    res.status(201).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: err.message });
    } else if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: err.message });
    } else {
      res.status(SERVER_ERROR_CODE).send({ message: err.message });
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
