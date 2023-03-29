import {
  IRequest, NextFunction, Request, Response,
} from 'express';
import Card from '../models/card';
import NotFoundError from '../errors/404-NotFound';
import Forbidden from '../errors/403-Forbidden';

export const addCard = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = new Card({
      name,
      link,
      owner,
    });
    await card.save();
    return res.status(201).json({ message: `Карточка с названием ${name} успешно создана.` });
  } catch (err) {
    next(err);
  }
};

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.send({ cards });
  } catch (err) {
    next(err);
  }
};

export const putLike = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!card) throw new NotFoundError('Карточки с таким ID не существует');
    return res.send({ message: 'Лайк поставлен.' });
  } catch (err) {
    next(err);
  }
};

export const deleteLike = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!card) throw new NotFoundError('Карточки с таким ID не существует');
    return res.send({ message: 'Лайк удален' });
  } catch (err) {
    next(err);
  }
};

export const deleteCard = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const card = await Card.findById(cardId);
    if (!card) throw new NotFoundError('Карточки с таким ID не существует');
    if (card.owner.toString() !== userId) throw new Forbidden('Пользователь не может удалять чужие карточки');
    await card.remove();
    return res.send({ message: 'Карточка удалена' });
  } catch (err) {
    next(err);
  }
};
