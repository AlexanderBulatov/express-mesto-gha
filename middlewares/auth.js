const {
  HTTP_STATUS_UNAUTHORIZED,
} = require('http2').constants;

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { jwtMesto = null } = req.cookies;

  if (!jwtMesto) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(jwtMesto, 'some-secret-key');
  } catch (err) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
  return null;
};
