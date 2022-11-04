const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
require('dotenv').config();

const { UNAUTHORIZED_ERROR_CODE } = require('../utils/errorCodes');

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: 'No token provided' });
  }
  return jwt.verify(
    token,
    NODE_ENV === 'production',
    JWT_SECRET,
    (err, decoded) => {
      if (err) {
        return res
          .status(UNAUTHORIZED_ERROR_CODE)
          .send({ message: 'Invalid token' });
      }
      req.user = decoded;
      return next();
    },
  );
};

module.exports = auth;
