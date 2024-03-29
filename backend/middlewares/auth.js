const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const UnauthorizedError = require('../utils/ErrorHandlers/ForbiddenError');

dotenv.config();
const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(
      new UnauthorizedError('Authorization required'),
    );
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    return next(
      new UnauthorizedError('Authorization required'),
    );
  }

  req.user = payload;

  return next();
};

module.exports = auth;
