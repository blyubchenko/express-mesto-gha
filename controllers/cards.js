const Card = require('../models/card');
const { HTTP_OK, HTTP_CREATED } = require('../errors/errors_status');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const BadRequestError = require('../errors/bad-request');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(HTTP_OK).send(cards))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        throw new ForbiddenError('Нельзя удалять чужие карточки');
      }
      return Card.findByIdAndRemove({ _id: card._id });
    })
    .then(() => res.status(HTTP_OK).send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для удаления карточки');
      }
      next(err);
    });
};

const postCard = (req, res, next) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.status(HTTP_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки');
      }
      return next(err);
    })
    .catch(next);
};

const addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      return res.status(HTTP_CREATED).send({ message: 'Лайк добавлен' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для постановки лайка');
      }
      return next(err);
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  if (!req.user._id) {
    throw new BadRequestError('Переданы некорректные данные для снятия лайка');
  } else {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Передан несуществующий _id карточки');
        }
        return res.status(HTTP_OK).send({ message: 'Лайк удален' });
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          throw new BadRequestError('Переданы некорректные данные для удаления лайка');
        }
        return next(err);
      })
      .catch(next);
  }
};

module.exports = {
  getCards,
  deleteCard,
  postCard,
  addLike,
  deleteLike,
};
