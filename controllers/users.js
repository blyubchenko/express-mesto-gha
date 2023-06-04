const User = require('../models/user');

const {
  HTTP_BAD_REQUEST, HTTP_NOT_FOUND, HTTP_SERVER_ERROR, HTTP_OK, HTTP_CREATED,
} = require('../errors/errors_status');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(HTTP_OK).send(users))
    .catch((err) => res.status(HTTP_SERVER_ERROR).send({ message: 'Ошибка по-умолчанию', err: err.message, stack: err.stack }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(HTTP_NOT_FOUND).send({ message: 'Пользователь c указанным _id не найден в БД' });
      }
      return res.status(HTTP_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(HTTP_BAD_REQUEST).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(HTTP_SERVER_ERROR).send({ message: 'Ошибка по-умолчанию', err: err.message, stack: err.stack });
    });
};

const postUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(HTTP_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(HTTP_SERVER_ERROR).send({ message: 'Ошибка по-умолчанию', err: err.message, stack: err.stack });
    });
};

const patchUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { $set: { name, about } }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res.status(HTTP_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(HTTP_OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(HTTP_SERVER_ERROR).send({ message: 'Ошибка по-умолчанию', err: err.message, stack: err.stack });
    });
};

const patchAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { $set: { avatar } }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res.status(HTTP_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(HTTP_OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(HTTP_SERVER_ERROR).send({ message: 'Ошибка по-умолчанию', err: err.message, stack: err.stack });
    });
};

module.exports = {
  getUsers,
  getUserById,
  postUser,
  patchUserInfo,
  patchAvatar,
};
