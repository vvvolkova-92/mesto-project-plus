import { Router } from 'express';
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
  validatorUpdateUserInfo,
  updateUserInfo,
);
// обновить аватар пользователя
userRouter.patch(
  patchUserAvatarPath,
  validatorUpdateUserAvatar,
  updateUserAvatar,
);

export default userRouter;
