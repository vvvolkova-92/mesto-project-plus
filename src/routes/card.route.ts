import { Router } from 'express';
import { check }from 'express-validator';
import config from "config";
import {addCard, getCardById, getCards} from "../controllers/cards";
import {putLike} from "../controllers/cards";

const cardRouter = Router();
const cardsPath: string = config.get('cardsPath');
const idCardsPath: string = config.get('idCardsPath');
const cardLikesPath: string = config.get('cardLikesPath');
//
cardRouter.post(
  cardsPath,
  [
    check('name', 'Некорректное название для карточки').isLength({min: 2, max: 30}),
    check('link', 'Некорректная ссылка').isURL(),
  ],
  addCard);
cardRouter.get(cardsPath, getCards);
cardRouter.get(idCardsPath, getCardById);
// поставить лайк
cardRouter.put(cardLikesPath, putLike);

export default cardRouter;