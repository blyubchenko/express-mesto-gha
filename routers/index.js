const router = require('express').Router();
const { NotFoundError } = require('../errors/not-found-err');

const { validateLogin, validatePostUser } = require('../middlewares/validaitionInServer');
const { login, postUser, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const cardRouter = require('./cards');
const userRouter = require('./users');

router.post('/signin', validateLogin, login);
router.post('/signup', validatePostUser, postUser);
router.get('/signout', logout);
router.use(auth);
router.use(cardRouter);
router.use(userRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
