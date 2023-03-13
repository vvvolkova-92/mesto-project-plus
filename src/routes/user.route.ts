import { Router } from 'express';
import { Request, Response} from "express";
import config from "config";
import { check, validationResult }from 'express-validator';
import User from "../models/user";
import {createUser} from "../controllers/users";

const router = Router();
const usersPath: string = config.get('usersPath');
const idUsersPath: string = config.get('idUsersPath');
router.post(
  usersPath,
  [
    check('name', 'Некорректное имя').isLength({min: 2, max: 30}),
    check('about', 'Слишком длинное описание').isLength({max: 200}),
    check('avatar', 'Некорректная ссылка').isURL(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) return res.status(400).json({
        errors: errors.array(),
        message: 'При попытке создать пользователя переданы некорректные данные',
      });
      await createUser(req, res);
    }
    catch (err) {
      res.status(500).json({message: "Ошибочка вышла, попробуйте снова."})
    }
  });

// router.get(usersPath, async (req: Request, res: Response) => {
//
// });
//
// router.get(idUsersPath, async (req: Request, res: Response) => {
//
// });

export default router;