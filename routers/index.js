const router = require('express').Router();
const { HTTP_NOT_FOUND } = require('../errors/errors_status');

const cardRouter = require('./cards');
const userRouter = require('./users');

router.use(cardRouter);
router.use(userRouter);
router.use((req, res) => {
  res.status(HTTP_NOT_FOUND).send({ message: 'Страница не найдена' });
});

module.exports = router;
