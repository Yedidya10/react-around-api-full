const mongoose = require('mongoose');

const Card = new mongoose.Schema({
  name: {
    type: String,
    validate: {
      validator(v) {
        return /^([A-Za-z0-9 ,.'"`-]{2,30})$/.test(v);
      },
      message: (props) => `${props.value} is not a valid name!`,
    },
    required: [true, 'Card name required'],
  },
  link: {
    type: String,
    validate: {
      validator(v) {
        return /((https?:\/\/)?[^\s.]+\.[\w][^\s]+)/.test(v);
      },
      message: (props) => `${props.value} is not a valid url address!`,
    },
    required: [true, 'User avatar url required'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Owner object required'],
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', Card);
