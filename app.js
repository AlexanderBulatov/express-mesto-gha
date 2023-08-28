const {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const router = require('./routes/index');

const auth = require('./middlewares/auth');

const {
  createUser, login,
} = require('./controllers/users');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {});
// .then(() => {
// drop users collection from previouse project
// mongoose.connection.db.dropCollection('users');
// }).then(() => { console.log('all right'); })
//   .catch((err) => { console.log(err); });

app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.use(auth);
app.use('/', router);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message = err.message } = err;
  res.status(statusCode).send({ message });
});

app.listen(PORT, () => {});
