import { Router } from 'express';
import { check } from 'express-validator';
import config from 'config';
import {
  getUsers, getUserById, updateUserInfo, updateUserAvatar, getUserInfo,
} from '../controllers/users';
import { validatorUpdateUserAvatar, validatorUpdateUserInfo, validatorUserId } from '../validator/celebrate';

const userRouter = Router();
const usersPath: string = config.get('usersPath');
const idUsersPath: string = config.get('idUsersPath');
const patchUserPath: string = config.get('patchUserPath');
const patchUserAvatarPath: string = config.get('patchUserAvatarPath');
// получить всех пользователей
userRouter.get(usersPath, getUsers);
// получить инфо о текущем пользователе
userRouter.get('/me', getUserInfo);
// получить пользователя по ID
userRouter.get(idUsersPath, validatorUserId, getUserById);
// обновить данные пользователя
userRouter.patch(
  patchUserPath,
  [
    check('name', 'Некорректное имя').isLength({ min: 2, max: 30 }),
    check('about', 'Некорректная длина').isLength({ min: 2, max: 200 }),
  ],
  validatorUpdateUserInfo,
  updateUserInfo,
);
// обновить аватар пользователя
userRouter.patch(
  patchUserAvatarPath,
  [
    check('avatar', 'Некорректная ссылка').isURL(),
  ],
  validatorUpdateUserAvatar,
  updateUserAvatar,
);

export default userRouter;
