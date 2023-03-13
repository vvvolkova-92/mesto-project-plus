import express from 'express';
import mongoose, {Error} from 'mongoose';
import config from 'config';

const PORT = process.env.PORT || config.get('port');


const app = express();

const start = async() => {
try {
  await mongoose.connect(config.get('mongoUri'));
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}...`)
  });
}
catch (err) {
  const error = (err as Error).message
  console.log('Ошибка сервера', error)
}
}

start();
