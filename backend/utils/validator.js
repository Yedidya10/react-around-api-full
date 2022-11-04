const validator = require('validator');

function validate(value, helpers) {
  if (validator.isURL(value)) {
    return value;
  }
  console.log('validate-Url failed');
  return helpers.error('string.uri');
}
module.exports = validate;
