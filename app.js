const express = require('express');

const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require('mongoose');
const indexRouter = require('./routers/index');

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '647ada2204adc96d0f08ab0d',
  };

  next();
});

app.use(indexRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Слушаю порт ${PORT}`);
});
