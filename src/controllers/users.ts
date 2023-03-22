import {NextFunction, Request, Response} from 'express';
import { validationResult } from 'express-validator';
import config from "config";
import bcrypt from 'bcryptjs';
import User from '../models/user';
import jwt from "jsonwebtoken";
import * as process from "process";
import * as dotenv from "dotenv";
import NotFoundError from "../errors/404-NotFound";
import BadRequest from "../errors/400-BadRequest";

dotenv.config();
const { JWT_SECRET } = process.env;

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'При попытке создать пользователя переданы некорректные данные',
      });
    }
    const { name = config.get('defaultName'), about = config.get('defaultAbout'), avatar = config.get('defaultAvatar'), email, password } = req.body;
    const isRegistered = await User.findOne({email});
    if(isRegistered) throw new BadRequest('Пользователь уже зарегистрирован');
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new User({ email, password: hashedPassword, name, about, avatar });
    await user.save();
    return res.status(201).json({ message: `Пользователь с именем ${name} успешно создан.` });
  } catch (err) {
    next(err);
  }
};

export const login = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'При попытке входа переданы некорректные данные',
      });
    }
    const {email, password} = req.body;
    const user = await User.findOne({email}).select('+password');
    if (!user) throw new BadRequest('Неправильная почта или пароль');

    const isMatchedPassword = await bcrypt.compare(password, user.password);
    if (!isMatchedPassword) throw new BadRequest('Неправильная почта или пароль');
    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET!,
      { expiresIn: '7d'});
    res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true
      });
    return res.json({token, _id: user._id})
  }
  catch (err) {
    next(err);
  }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);
    if (!user) throw new NotFoundError('Пользователь не найден');
    return res.send({ user });
  } catch (err) {
    next(err);
  }
};

export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    if (!user) throw new NotFoundError('Пользователь не найден');
    return res.json({ user });
  } catch (err) {
    next(err);
  }
};


export const updateUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'При попытке обновить пользователя переданы некорректные данные',
      });
    }
    const id = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(id, { name, about });
    if (!user) throw new BadRequest('Пользователь не найден или введены некорректные данные');
    await user.save();
    return res.status(201).json({ message: 'Пользователь успешно обновлен.' });
  } catch (err) {
    next(err);
  }
};

export const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'При попытке обновить аватар пользователя введена некорректная ссылка',
      });
    }
    const id = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(id, { avatar });
    if (!user) throw new BadRequest('Пользователь не найден или введены некорректные данные');
    await user.save();
    return res.status(201).json({ message: 'Аватар пользователя успешно обновлен.' });
  } catch (err) {
    next(err);
  }
};
