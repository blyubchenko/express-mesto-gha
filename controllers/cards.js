const Card = require('../models/card');
const {
  HTTP_BAD_REQUEST, HTTP_NOT_FOUND, HTTP_SERVER_ERROR, HTTP_OK, HTTP_CREATED,
} = require('../errors/errors_status');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(HTTP_OK).send(cards))
    .catch((err) => res.status(HTTP_SERVER_ERROR).send({ message: 'На сервере произошла ошибка', err: err.message, stack: err.stack }));
};

const deleteCard = (req, res) => {
  Card.deleteOne({ _id: req.params.cardId })
    .then((card) => {
      if (card.deletedCount === 0) {
        return res.status(HTTP_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(HTTP_OK).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(HTTP_BAD_REQUEST).send({ message: 'Переданы некорректные данные для удаления карточки' });
      }
      return res.status(HTTP_SERVER_ERROR).send({ message: 'На сервере произошла ошибка', err: err.message, stack: err.stack });
    });
};

const postCard = (req, res) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.status(HTTP_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(HTTP_SERVER_ERROR).send({ message: 'На сервере произошла ошибка', err: err.message, stack: err.stack });
    });
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(HTTP_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(HTTP_CREATED).send({ message: 'Лайк добавлен' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(HTTP_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(HTTP_SERVER_ERROR).send({ message: 'На сервере произошла ошибка', err: err.message, stack: err.stack });
    });
};

const deleteLike = (req, res) => {
  if (!req.user._id) {
    res.status(HTTP_BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
  } else {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          return res.status(HTTP_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        }
        return res.status(HTTP_OK).send({ message: 'Лайк удален' });
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          return res.status(HTTP_BAD_REQUEST).send({ message: 'Переданы некорректные данные для удаления лайка' });
        }
        return res.status(HTTP_SERVER_ERROR).send({ message: 'На сервере произошла ошибка', err: err.message, stack: err.stack });
      });
  }
};

module.exports = {
  getCards,
  deleteCard,
  postCard,
  addLike,
  deleteLike,
};
