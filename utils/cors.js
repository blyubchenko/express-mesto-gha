const allowedCors = {
  origin: [
    'http://mesto.blyubchenko.nomoreparties.sbs',
    'https://mesto.blyubchenko.nomoreparties.sbs',
    'http://localhost:3000',
    'https://localhost:3000',
  ],
  credentials: true,
};
module.exports = allowedCors;
