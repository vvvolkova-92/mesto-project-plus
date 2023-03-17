import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Error } from 'mongoose';
import config from "config";
import bcrypt from 'bcryptjs';
import User from '../models/user';


export const createUser = async (req: Request, res: Response) => {
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
    if(isRegistered) return res.status(400).json({message: "Такой пользователь уже существует"});
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new User({ email, password: hashedPassword, name, about, avatar });
    await user.save();
    return res.status(201).json({ message: `Пользователь с именем ${name} успешно создан.` });
  } catch (err) {
    const errorName = (err as Error).name;
    if (errorName === 'ValidationError') return res.status(400).json({ message: 'Переданы некорректные данные' });
    return res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
};

export const login = async(req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'При попытке входа переданы некорректные данные',
      });
    }

    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user) return res.status(400).json({message: `Неправильная почта или пароль`})

    const isMatchedPassword = await bcrypt.compare(user.password, password);
    if (!isMatchedPassword) return res.status(400).json({message: `Неправильная почта или пароль`});

  }
  catch (err) {
    const errorName = (err as Error).name;
    if (errorName === 'ValidationError') return res.status(400).json({ message: 'Переданы некорректные данные' });
    return res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден.' });
    return res.status(200).json({ user });
  } catch (err) {
    const errorName = (err as Error).name;
    if (errorName === 'CastError') return res.status(400).json({ message: 'Переданы некорректные данные' });
    return res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
};

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'При попытке обновить пользователя переданы некорректные данные',
      });
    }
    // @ts-ignore
    const id = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(id, { name, about });
    if (!user) return res.status(400).json({ message: 'Пользователь не найден или введены некорректные данные.' });
    await user.save();
    return res.status(201).json({ message: 'Пользователь успешно обновлен.' });
  } catch (err) {
    const errorName = (err as Error).name;
    if ((errorName === 'CastError') || (errorName === 'ValidationError')) return res.status(400).json({ message: 'Переданы некорректные данные' });
    return res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'При попытке обновить аватар пользователя введена некорректная ссылка',
      });
    }
    // @ts-ignore
    const id = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(id, { avatar });
    if (!user) return res.status(400).json({ message: 'Пользователь не найден или введены некорректные данные.' });
    await user.save();
    return res.status(201).json({ message: 'Аватар пользователя успешно обновлен.' });
  } catch (err) {
    const errorName = (err as Error).name;
    if ((errorName === 'CastError') || (errorName === 'ValidationError')) return res.status(400).json({ message: 'Переданы некорректные данные' });
    return res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
};
