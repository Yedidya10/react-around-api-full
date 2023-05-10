const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { errors } = require('celebrate');
const errorHandlers = require('./middlewares/errorHandlers');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');

const notFoundMessage = require('./utils/notFound');
const { NotFoundError } = require('./utils/ErrorHandlers/NotFoundError');

const users = require('./routes/users');
const cards = require('./routes/cards');
const signin = require('./routes/signin');
const signup = require('./routes/signup');

const app = express();
app.use(cors());

const db = mongoose.connection;
dotenv.config();

// Server
const MONGODB_CONNECTION = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URL : 'mongodb://localhost:27017/mestodb';
mongoose.connect(MONGODB_CONNECTION);
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// Routes
app.use(express.json());

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Server will crash now');
//   }, 0);
// });

app.use(requestLogger);
app.use(errorLogger);
app.use(errors());
app.use(errorHandlers);

app.use('/signin', signin);
app.use('/signup', signup);
app.use('/users', auth, users);
app.use('/cards', auth, cards);
app.use('/', (req, res, next) => {
  return next(new NotFoundError(notFoundMessage));
});

// PORT
const { PORT = 3000 } = process.env;
app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  return null;
});

module.exports = app;
