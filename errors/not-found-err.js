const {
  HTTP_STATUS_NOT_FOUND,
} = require('http2').constants;

class NotFoundError extends Error {
  constructor(name, message) {
    super();
    this.statusCode = HTTP_STATUS_NOT_FOUND;
    this.message = `Запись с переданным _id не найдена. Ошибка: ${name}. Сообщение ошибки: ${message}`;
  }
}

module.exports = NotFoundError;
