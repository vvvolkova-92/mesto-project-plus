import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose, {Error} from 'mongoose';
import config from 'config';
import userRouter from "./routes/user.route";
import cardRouter from "./routes/card.route";
import {createUser, login} from "./controllers/users";
import {check} from "express-validator";
import {JwtPayload} from "jsonwebtoken";
import auth from "./middlewares/auth";

declare global {
  namespace Express {
    interface Request {
      user: { _id: string | JwtPayload }
    }
  }
}

const PORT = process.env.PORT || config.get('port');
const app = express();
app.use(express.json());
// не требующие авторизации
app.post(
  '/signin',
  [
    check('email', 'Некорректный адрес электронной почты').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  login);
app.post(
  '/signup',
  [
    check('email', 'Некорректный адрес электронной почты').normalizeEmail().isEmail(),
    check('name', 'Некорректное имя').optional().isLength({ min: 2, max: 30 }),
    check('about', 'Некорректная длина').optional().isLength({ min: 2, max: 30 }),
    check('avatar', 'Некорректная ссылка').optional().isURL(),
  ],
  createUser);
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req: Request,res: Response) => {
  res.status(404).json({ message: 'Страница не найдена' });
  return;
});

const start = async() => {
  try {
    dotenv.config();
    await mongoose.connect(config.get('mongoUri'));
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}...`)
    });
  }
  catch (err) {
    const error = (err as Error).message
    console.log('Ошибка сервера', error)
  }
};
start();