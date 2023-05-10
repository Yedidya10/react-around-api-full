const validator = require('validator');

function validate(value) {
  if (validator.isURL(value, [{ allow_underscores: true }])) {
    return value;
  }
  const error = new Error('invalid url link');
  error.statusCode = 400;
  throw error;
}
module.exports = validate;
