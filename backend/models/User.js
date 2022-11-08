const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const User = new mongoose.Schema({
  username: {
    type: String,
    validate: {
      validator(v) {
        return /^([A-Za-z0-9 ,.'"`-]{2,30})$/gm.test(v);
      },
      message: (props) => `${props.value} is not a valid username!`,
    },
    default: 'Jacques Cousteau',
  },
  email: {
    type: String,
    validate: {
      validator: (v) => validator.isEmail(v, {
        require_tld: true,
        allow_utf8_local_part: false,
      }),
      message: (props) => `${props.value} is not a valid email!`,
    },
    required: [true, 'Email are required'],
  },
  password: {
    type: String,
    validate: {
      validator(v) {
        return /^([A-Za-z0-9#$!@&%]{8,30})$/gm.test(v);
      },
      message: (props) => `${props.value} is not a valid password!`,
    },
    required: [true, 'Password are required'],
    select: false,
  },
  about: {
    type: String,
    validate: {
      validator(v) {
        return /^([A-Za-z0-9 ,.'`-]{2,30})$/gm.test(v);
      },
      message: (props) => `${props.value} is not a valid about!`,
    },
    default: 'Explorer',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v, [{ allow_underscores: true }]),
      message: (props) => `${props.value} is not a valid url address!`,
    },
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
  },
});

User.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Incorrect email or password'));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', User);
