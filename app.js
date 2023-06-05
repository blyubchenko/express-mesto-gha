const express = require('express');

const app = express();
const mongoose = require('mongoose');
const indexRouter = require('./routers/index');
const { PORT, MONGODB_URI } = require('./config/config');

mongoose.connect(MONGODB_URI, {
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
