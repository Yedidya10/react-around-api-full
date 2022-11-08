const validator = require('validator');
const {
  BAD_REQUEST_ERROR_CODE,
} = require('./utils/errorCodes');

function validate(value) {
  if (validator.isURL(value, [{ allow_underscores: true }])) {
    return value;
  }
  const error = new Error('invalid url link');
  error.statusCode = BAD_REQUEST_ERROR_CODE;
  throw error;
}
module.exports = validate;
