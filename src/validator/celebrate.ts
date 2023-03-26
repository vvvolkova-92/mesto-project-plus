import { celebrate, Joi } from 'celebrate';

const urlRegExp: RegExp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
// 1 - карточки
// 1.1 новая карточка
export const validatorAddCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegExp),
  }),
});
// 1.2 айди карточки
export const validatorCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).alphanum(),
  }),
});
// 2 - пользователи
// 2.1 айди пользователя
export const validatorUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).alphanum(),
  }),
});
// 2.2 создание пользователя
export const validatorCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().pattern(urlRegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
// 2.3 логин
export const validatorloginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
// 2.4 обновить данные пользователя
export const validatorUpdateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});
// 2.5 обновить аватар
export const validatorUpdateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegExp),
  }),
});
