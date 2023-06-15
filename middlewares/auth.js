const jwt = require('jsonwebtoken');
const { HTTP_UNAUTHORIZED } = require('../errors/errors_status');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log(req.cookies.jwt);
  if (!token) {
    return res
      .status(HTTP_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return res
      .status(HTTP_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;

  next();
};
