import { Request, Response} from "express";
import User from "../models/user";
import {validationResult} from "express-validator";

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

export const getAllUsers = async (req: Request, res: Response) => {
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
    res.status(200).json({user})
  }
  catch (err) {
    res.status(500).json({message: "Ошибочка вышла, попробуйте снова."})
  }
};
