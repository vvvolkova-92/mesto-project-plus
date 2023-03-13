import { Request, Response} from "express";
import User from "../models/user";

export const createUser = async(req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  const user = new User({name, about, avatar});
  await user.save();
  res.status(201).json({message: `Пользователь с именем ${name} успешно создан.`})
};