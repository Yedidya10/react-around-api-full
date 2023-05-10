const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
const BadRequestError = require('../utils/ErrorHandlers/BadRequestError');
const NotFoundError = require('../utils/ErrorHandlers/NotFoundError');
const ServerError = require('../utils/ErrorHandlers/ServerError');
const UnauthorizedError = require('../utils/ErrorHandlers/ForbiddenError');
import ConflictError from '../utils/ErrorHandlers/ConflictError';

dotenv.config();
const { NODE_ENV, JWT_SECRET } = process.env;

let userId;

const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.send({ data: user });
    } else {
      throw new NotFoundError('User not found');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid user'));
    } else {
      return next(new ServerError('Internal server error'));
    }
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user == null) {
      throw new NotFoundError('User not found');
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid user'));
    } else {
      return next(new ServerError('Internal server error'));
    }
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (users == null) {
      return next(new NotFoundError('Users not found'));
    }
    res.status(200).send(users);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid user'));
    } else {
      return next(new ServerError('Internal server error'));
    }
  }
};

const postUser = async (req, res, next) => {
  const { username, about, avatar, email, password } = req.body;
  try {
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return  next(new ConflictError(`User with email ${email} already exists`));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    return res.status(201).send(user);
  } catch (err) {
  if (err.name === 'CastError') {
    return  next(new BadRequestError('Invalid user'));
  } else if (err.name === 'ValidationError') {
    return  next(new BadRequestError('Invalid data'));
  } else {
    return  next(new ServerError('Internal server error'));
  }
}
};

const patchUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (user == null) {
      return next(new NotFoundError('User not found'));
    }
    res.status(201).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid user'));
    } else if (err.name === 'ValidationError') {
      return next(new BadRequestError('Invalid data'));
    } else {
      return next(new ServerError('Internal server error'));
    }
  }
};

const patchUserAvatar = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (user == null) {
      return next(new NotFoundError('User not found'));
    }
    res.status(201).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid user'));
    } else if (err.name === 'ValidationError') {
      return next(new BadRequestError('Invalid data'));
    } else {
      return next(new ServerError('Internal server error'));
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
        { expiresIn: '7d' },
      ),
    });
  } catch (err) {
    return next(new UnauthorizedError('Incorrect email or password'));
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
