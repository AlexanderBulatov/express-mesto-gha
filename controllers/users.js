const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const CustomError = require('../errors/customError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(HTTP_STATUS_OK).send({ data: users });
    })
    .catch((err) => next(new CustomError(err)));
};

module.exports.findUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(HTTP_STATUS_OK).send({ data: user }))
    .catch((err) => next(new CustomError(err)));
};

module.exports.createUser = (req, res, next) => {
  let {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      ({
        name, about, avatar, email, password,
      } = user);
      res.status(HTTP_STATUS_CREATED).send({
        name, about, avatar, email, _id: user._id,
      });
    })
    .catch((err) => next(new CustomError(err)));
};

module.exports.updateUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, req.body, { returnDocument: 'after', runValidators: true })
    .orFail()
    .then((user) => res.status(HTTP_STATUS_OK).send({ data: user }))
    .catch((err) => next(new CustomError(err)));
};

module.exports.updateUserAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { returnDocument: 'after', runValidators: true })
    .orFail()
    .then((user) => res.status(HTTP_STATUS_OK).send({ data: user }))
    .catch((err) => next(new CustomError(err)));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('jwtMesto', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        });
      res.status(HTTP_STATUS_OK).send({
        email: user.email, name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      })
        .end();
    })
    .catch((err) => next(new CustomError(err)));
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => res.status(HTTP_STATUS_OK).send({ data: user }))
    .catch((err) => next(new CustomError(err)));
};
