const { PORT = 3000 } = process.env;
const { MONGODB_URI = 'mongodb://127.0.0.1/mestodb' } = process.env;

module.exports = {
  PORT,
  MONGODB_URI,
};
