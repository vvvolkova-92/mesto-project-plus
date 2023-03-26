import { Router } from 'express';
import { check } from 'express-validator';
import config from 'config';
import {
  addCard, deleteCard, deleteLike, getCards, putLike,
} from '../controllers/cards';
import { validatorAddCard, validatorCardId } from '../validator/celebrate';

const cardRouter = Router();
const cardsPath: string = config.get('cardsPath');
const idCardsPath: string = config.get('idCardsPath');
const cardLikesPath: string = config.get('cardLikesPath');

// добавить новую карточку
cardRouter.post(
  cardsPath,
  [
    check('name', 'Некорректное название для карточки').isLength({ min: 2, max: 30 }),
    check('link', 'Некорректная ссылка').isURL(),
  ],
  validatorAddCard,
  addCard,
);
// все карточки
cardRouter.get(cardsPath, getCards);
// поставить лайк
cardRouter.put(cardLikesPath, validatorCardId, putLike);
// удалить лайк
cardRouter.delete(cardLikesPath, validatorCardId, deleteLike);
// удалить карточку
cardRouter.delete(idCardsPath, validatorCardId, deleteCard);
export default cardRouter;
