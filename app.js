require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const indexRouter = require('./routers/index');
const { validateLogin, validatePostUser } = require('./middlewares/validaitionInServer');
const { login, postUser, logout } = require('./controllers/users');
const { HTTP_SERVER_ERROR } = require('./errors/errors_status');

const { MONGODB_URI = 'mongodb://127.0.0.1/mestodb' } = process.env;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(express.json());
app.use(cookieParser());
app.post('/signin', validateLogin, login);
app.post('/signup', validatePostUser, postUser);
app.get('/signout', logout);
app.use(auth);
app.use(indexRouter);
app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === HTTP_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Слушаю порт ${PORT}`);
});
