const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_CONFLICT,
} = require('http2').constants;

const mongoose = require('mongoose');

class CustomError extends Error {
  constructor(err) {
    super();

    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      this.statusCode = HTTP_STATUS_NOT_FOUND;
      this.message = `Запись не найдена. Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`;
    } else if (err instanceof mongoose.Error.ValidationError) {
      this.statusCode = HTTP_STATUS_BAD_REQUEST;
      this.message = `Переданы некорректные данные. Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`;
    } else if (err instanceof mongoose.Error.CastError) {
      this.statusCode = HTTP_STATUS_BAD_REQUEST;
      this.message = `Некорректный формат _id. Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`;
    } else if (err.message === 'Bad login') {
      this.statusCode = HTTP_STATUS_UNAUTHORIZED;
      this.message = `Ошибка авторизации. Проверьте почту и пароль. Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`;
    } else if (err.message === 'Forbidden delete') {
      this.statusCode = HTTP_STATUS_FORBIDDEN;
      this.message = `Недостаточно прав. Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`;
    } else if (err.message === 'Bad delete') {
      this.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
      this.message = `Возникла ошибка при удалении карточки. Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`;
    } else if (err.code === 11000) {
      this.statusCode = HTTP_STATUS_CONFLICT;
      this.message = `Пользователь с таким email уже существует. Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`;
    } else {
      this.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR;
      this.message = `Ошибка: ${err.name}. Сообщение ошибки: ${err.message}`;
    }
  }
}

module.exports = CustomError;
