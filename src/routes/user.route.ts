import { Router } from 'express';
import { check }from 'express-validator';
import config from "config";
import {createUser, getAllUsers, getUserById} from "../controllers/users";

const router = Router();
const usersPath: string = config.get('usersPath');
const idUsersPath: string = config.get('idUsersPath');
router.post(
  usersPath,
  [
    check('name', 'Некорректное имя').isLength({min: 2, max: 30}),
    check('about', 'Некорректная длина').isLength({min: 2, max: 200}),
    check('avatar', 'Некорректная ссылка').isURL(),
  ],
  createUser);
router.get(usersPath, getAllUsers);
router.get(idUsersPath, getUserById);

export default router;