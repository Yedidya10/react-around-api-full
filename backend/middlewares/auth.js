const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
require('dotenv').config();
const { UNAUTHORIZED_ERROR_CODE } = require('../utils/errorCodes');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(UNAUTHORIZED_ERROR_CODE).send({ message: 'No token provided' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'
    );
  } catch (err) {
    res.status(UNAUTHORIZED_ERROR_CODE).send({ message: 'No token provided' });
  }

  req.user = payload;

  next();
};

module.exports = auth;
