import { Router } from 'express';
import { check } from 'express-validator';
import config from 'config';
import {
  getUsers, getUserById, updateUserInfo, updateUserAvatar,
} from '../controllers/users';

const userRouter = Router();
const usersPath: string = config.get('usersPath');
const idUsersPath: string = config.get('idUsersPath');
const patchUserPath: string = config.get('patchUserPath');
const patchUserAvatarPath: string = config.get('patchUserAvatarPath');
// получить всех пользователей
userRouter.get(usersPath, getUsers);
// получить пользователя по ID
userRouter.get(idUsersPath, getUserById);
// обновить данные пользователя
userRouter.patch(
  patchUserPath,
  [
    check('name', 'Некорректное имя').isLength({ min: 2, max: 30 }),
    check('about', 'Некорректная длина').isLength({ min: 2, max: 200 }),
  ],
  updateUserInfo,
);
// обновить аватар пользователя
userRouter.patch(
  patchUserAvatarPath,
  [
    check('avatar', 'Некорректная ссылка').isURL(),
  ],
  updateUserAvatar,
);

export default userRouter;
