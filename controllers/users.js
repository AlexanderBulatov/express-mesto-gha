const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;

const mongoose = require('mongoose');

const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(HTTP_STATUS_OK).send({ data: users }))
    .catch((err) => {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: `Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
      });
    });
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(HTTP_STATUS_OK).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: `Пользователь с переданным _id не существует. Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
        });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Некорректный формат _id. Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
        });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: `Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
      });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_CREATED).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные. Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
        });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: `Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
      });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, req.body, { returnDocument: 'after', runValidators: true })
    .orFail()
    .then((user) => res.status(HTTP_STATUS_OK).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: `Пользователь с переданным _id не существует. Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
        });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Некорректный формат _id. Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
        });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные. Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
        });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: `Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
      });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { returnDocument: 'after', runValidators: true })
    .orFail()
    .then((user) => res.status(HTTP_STATUS_OK).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: `Пользователь с переданным _id не существует. Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
        });
      }
      if (err instanceof mongoose.Error.ValidationError
         || err instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные. Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
        });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: `Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
      });
    });
};
