import { Router } from 'express';
import { check }from 'express-validator';
import config from "config";
import {addCard, deleteLike, getCardById, getCards, putLike} from "../controllers/cards";

const cardRouter = Router();
const cardsPath: string = config.get('cardsPath');
const idCardsPath: string = config.get('idCardsPath');
const cardLikesPath: string = config.get('cardLikesPath');
// добавить новую карточку
cardRouter.post(
  cardsPath,
  [
    check('name', 'Некорректное название для карточки').isLength({min: 2, max: 30}),
    check('link', 'Некорректная ссылка').isURL(),
  ],
  addCard);
// все карточки
cardRouter.get(cardsPath, getCards);
// карточка по ID
cardRouter.get(idCardsPath, getCardById);
// поставить лайк
cardRouter.put(cardLikesPath, putLike);
// удалить лайк
cardRouter.delete(cardLikesPath, deleteLike);
export default cardRouter;