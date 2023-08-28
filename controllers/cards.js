const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;

const mongoose = require('mongoose');
const Card = require('../models/card');
const CustomError = require('../errors/customError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.status(HTTP_STATUS_OK).send({ data: card }))
    .catch((err) => next(new CustomError(err)));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(HTTP_STATUS_CREATED).send({ data: card }))
    .catch((err) => next(new CustomError(err)));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (String(card.owner) !== req.user._id) {
        return Promise.reject(new Error('Forbidden delete'));
      }

      return Card.deleteOne({ _id: req.params.cardId })
        .then((resObj) => ({ resObj, card }))
        .catch((err) => next(new CustomError(err)));
    })
    .then(({ resObj, card }) => {
      if (!resObj.deletedCount) return Promise.reject(new Error('Bad delete'));
      res.status(HTTP_STATUS_OK).send({ data: card });
      return null;
    })
    .catch((err) => next(new CustomError(err)));
};
// Card.findByIdAndRemove({_id: req.params.cardId, owner: req.user._id})
//   .orFail()
//   .then((card) => res.send({ data: card }))
//   .catch((err) => {
//     if (err instanceof mongoose.Error.DocumentNotFoundError) {
//       return res.status(HTTP_STATUS_NOT_FOUND).send({
//         message:
// `Карточки с переданным _id не существует.
//  Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
//       });
//     }
//     if (err instanceof mongoose.Error.CastError) {
//       return res.status(HTTP_STATUS_BAD_REQUEST).send({
//         message:
// `Некорректный формат _id.
// Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
//       });
//     }
//     return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
//       message: `Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
//     });
//   });

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((card) => {
      res.status(HTTP_STATUS_OK).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: `Карточки с переданным _id не существует. Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
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

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((card) => res.status(HTTP_STATUS_OK).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: `Карточки с переданным _id не существует. Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`,
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
