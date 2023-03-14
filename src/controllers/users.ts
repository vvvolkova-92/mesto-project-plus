import { Request, Response} from "express";
import User from "../models/user";
import {validationResult} from "express-validator";
import Card from "../models/card";

export const createUser = async(req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({
      errors: errors.array(),
      message: 'При попытке создать пользователя переданы некорректные данные',
    });
    const { name, about, avatar } = req.body;
    const user = new User({name, about, avatar});
    await user.save();
    res.status(201).json({message: `Пользователь с именем ${name} успешно создан.`})
  }
  catch (err) {
    res.status(500).json({message: "Ошибочка вышла, попробуйте снова."})
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(200).json({users})
  }
  catch (err) {
    res.status(500).json({message: "Ошибочка вышла, попробуйте снова."})
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);
    if(!user) return res.status(404).json({message: "Пользователь не найден."})
    res.status(200).json({user})
  }
  catch (err) {
    res.status(500).json({message: "Ошибочка вышла, попробуйте снова."})
  }
};

export const updateUserInfo = async(req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({
      errors: errors.array(),
      message: 'При попытке обновить пользователя переданы некорректные данные',
    });
    // @ts-ignore
    const id = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(id, {name, about});
    if(!user) return res.status(400).json({message: "Пользователь не найден или введены некорректные данные."});
    await user.save();
    res.status(201).json({message: `Пользователь успешно обновлен.`})
  }
  catch (err) {
    res.status(500).json({message: "Ошибочка вышла, попробуйте снова."})
  }
};

export const updateUserAvatar = async(req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({
      errors: errors.array(),
      message: 'При попытке обновить аватар пользователя введена некорректная ссылка',
    });
    // @ts-ignore
    const id = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(id, { avatar });
    if(!user) return res.status(400).json({message: "Пользователь не найден или введены некорректные данные."});
    await user.save();
    res.status(201).json({message: "Аватар пользователя успешно обновлен."})
  }
  catch (err) {
    res.status(500).json({message: "Ошибочка вышла, попробуйте снова."});
  }
};


