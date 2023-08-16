const { HTTP_STATUS_NOT_FOUND } = require('http2').constants;
const router = require('express').Router();

const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/', usersRouter);
router.use('/', cardsRouter);
router.use('*', (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({
    message: `Путь ${`${req.protocol}://${req.get('host')}${req.originalUrl}`} не существует`,
  });
});
module.exports = router;
