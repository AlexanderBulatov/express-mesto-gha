const {
  HTTP_STATUS_BAD_REQUEST,
} = require('http2').constants;

class BadReqError extends Error {
  constructor(message, errName, errMessage) {
    console.log(message);
    super();
    this.statusCode = HTTP_STATUS_BAD_REQUEST;
    this.message = `${message} Ошибка: ${errName}. Сообщение ошибки: ${errMessage}`;
  }
}

module.exports = BadReqError;
