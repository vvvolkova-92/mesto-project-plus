import * as dotenv from 'dotenv';
import express, {Request, Response} from 'express';
import mongoose, {Error} from 'mongoose';
import config from 'config';
import userRouter from "./routes/user.route";
import cardRouter from "./routes/card.route";
import {createUser, login} from "./controllers/users";
import {check} from "express-validator";
import {JwtPayload} from "jsonwebtoken";
import auth from "./middlewares/auth";
import cookieParser from "cookie-parser";
import nextErrors from "./middlewares/error";
import { requestLogger, errorLogger } from './middlewares/logger';
import NotFoundError from "./errors/404-NotFound";
import {validatorCreateUser, validatorloginUser} from "./validator/celebrate";
import {errors} from "celebrate";
declare global {
  namespace Express {
    interface Request {
      user: { _id: string | JwtPayload }
    }
  }
}

declare module 'jsonwebtoken' {
  export interface UserIDJwtPayload extends JwtPayload {
    _id: string;
  }
}

const PORT = process.env.PORT || config.get('port');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
// не требующие авторизации
app.post(
  '/signin',
  [
    check('email', 'Некорректный адрес электронной почты').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  validatorloginUser,
  login);
app.post(
  '/signup',
  [
    check('email', 'Некорректный адрес электронной почты').normalizeEmail().isEmail(),
    check('name', 'Некорректное имя').optional().isLength({ min: 2, max: 30 }),
    check('about', 'Некорректная длина').optional().isLength({ min: 2, max: 30 }),
    check('avatar', 'Некорректная ссылка').optional().isURL(),
  ],
  validatorCreateUser,
  createUser);
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(() => {
  throw new NotFoundError('Страница не найдена');
});
app.use(errorLogger);
app.use(errors());
app.use(nextErrors);

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