const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// const User = Joi.object({
//   username: Joi.string()
//     .pattern(/^([A-Za-z0-9 ,'"`-])$/)
//     .min(2)
//     .max(30)
//     .default('Jacques Cousteau'),

//   password: Joi.string()
//     .pattern(/^([a-zA-Z0-9])$/)
//     .min(8)
//     .max(30)
//     .required(),

//   email: Joi.string()
//     .email({ minDomainSegments: 2, tlds: { allow: true } })
//     .required(),

//   about: Joi.string()
//     .pattern(/^([A-Za-z0-9 ,'"`-])$/)
//     .default('Explorer'),

//   avatar: Joi.string()
//     .domain()
//     .default('https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg'),
// });

const User = new mongoose.Schema({
  username: {
    type: String,
    validate: {
      validator(v) {
        return /^([A-Za-z0-9 ,.'"`-]{2,30})$/gm.test(v);
      },
      message: (props) => `${props.value} is not a valid name!`,
    },
    required: [true, 'User name required'],
  },
  email: {
    type: String,
    validate: {
      validator(v) {
        return /^((?!\.)[\w_.-]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
    required: [true, 'email are required'],
  },
  password: {
    type: String,
    validate: {
      validator(v) {
        return /^([A-Za-z0-9]{8,30})$/gm.test(v);
      },
      message: (props) => `${props.value} is not a valid password!`,
    },
    required: [true, 'password are required'],
  },
  about: {
    type: String,
    validate: {
      validator(v) {
        return /^([A-Za-z0-9 ,.'`-]{2,30})$/gm.test(v);
      },
      message: (props) => `${props.value} is not a valid about!`,
    },
    required: [true, 'User about required'],
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return /((https?:\/\/)?[^\s.]+\.[\w][^\s]+)/gm.test(v);
      },
      message: (props) => `${props.value} is not a valid url address!`,
    },
    required: [true, 'User avatar url required'],
  },
});

User.statics.findUserByCredentials = async function(email, password) {
  let user = await User.findOne({ email });
  if (!user) {
    throw new Error('Unable to Login');
  }
  const isMatch = bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Unable to Login');
  }
  return user;
};

module.exports = mongoose.model('user', User);
