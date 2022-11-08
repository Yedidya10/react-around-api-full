const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { celebrate, Joi, errors } = require('celebrate');
const errorHandlers = require('./middlewares/errorHandlers');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');

const app = express();
const db = mongoose.connection;
const notFoundMessage = require('./utils/notFound');
const { postUser, login } = require('./controllers/users');
const users = require('./routes/users');
const cards = require('./routes/cards');
dotenv.config();
require('dotenv').config();
const {
  NOT_FOUND_ERROR_CODE,
  // UNAUTHORIZED_ERROR_CODE,
  SERVER_ERROR_CODE,
} = require('./utils/errorCodes');

// Server
mongoose.connect('mongodb://localhost:27017/aroundb');
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// Routes
app.use(helmet());
app.use(express.json());
app.use(auth);

// using CORS
// const corsOptions = {
//   origin: [
//     'http://www.yedidya.students.nomoredomainssbs.ru',
//     'http://yedidya.students.nomoredomainssbs.ru',
//     'https://www.yedidya.students.nomoredomainssbs.ru',
//     'https://yedidya.students.nomoredomainssbs.ru'
//   ],
//   optionsSuccessStatus: 200,
// };

app.use(cors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(8).max(30),
    }),
  }),
  login
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().min(2),
      password: Joi.string().required().min(8).max(30),
    }),
  }),
  postUser
);

app.use('/', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send(notFoundMessage);
});
app.use((err, req, res) => res.status(SERVER_ERROR_CODE).send({ error: err }));
app.use('/users', auth, users);
app.use('/cards', auth, cards);

app.get('*', () => {
  throw new Error(notFoundMessage);
});

app.use(requestLogger);
app.use(errorLogger);
app.use(errors());
app.use(errorHandlers);

// PORT
const { PORT = 3000 } = process.env;
app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  return null;
});

module.exports = app;
