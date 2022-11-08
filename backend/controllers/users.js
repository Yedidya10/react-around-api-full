const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();
const { NODE_ENV, JWT_SECRET } = process.env;
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_CODE,
} = require('../utils/errorCodes');
let userId;

const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.send({ data: user });
    } else {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: 'user not found!' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: err.message });
    } else {
      res.status(SERVER_ERROR_CODE).send({ message: err.message });
    }
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user == null) {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: 'user not found!' });
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: err.message });
    } else {
      res.status(SERVER_ERROR_CODE).send({ message: err.message });
    }
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (users == null) {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: 'users not found!' });
    }
    res.status(200).send(users);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: err.message });
    } else {
      res.status(SERVER_ERROR_CODE).send({ message: err.message });
    }
  }
};

const postUser = async (req, res, next) => {
  const { username, about, avatar, email, password } = req.body;
  try {
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return res
        .status(200)
        .send({ message: `User with email ${email} already exists` });
    } else {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
          username,
          about,
          avatar,
          email,
          password: hashedPassword,
        });
        res.status(201).send(user);
      } catch (err) {
        next(err);
      }
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: err.message });
    } else if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: err.message });
    } else {
      res.status(SERVER_ERROR_CODE).send({ message: err.message });
    }
    next(err);
  }
};

const patchUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (user == null) {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: 'user not found!' });
    }
    res.status(201).send(user);
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

const patchUserAvatar = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (user == null) {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: 'user not found!' });
    }
    res.status(201).send(user);
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

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    userId = await user._id;
    res.send({
      token: jwt.sign(
        { _id: userId },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' }
      ),
    });
  } catch (err) {
    next(new Error('Invalid email or password'));
  }
};

module.exports = {
  postUser,
  getUsers,
  getUserById,
  patchUserProfile,
  patchUserAvatar,
  getUserInfo,
  login,
};
