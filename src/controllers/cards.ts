import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Error } from 'mongoose';
import Card from '../models/card';

export const addCard = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'При попытке добавить карточку переданы некорректные данные',
      });
    }
    const { name, link, createdAt = Date.now() } = req.body;
    const owner = req.user._id;
    const card = new Card({
      name,
      link,
      createdAt,
      owner,
    });
    await card.save();
    return res.status(201).json({ message: `Карточка с названием ${name} успешно создана.` });
  } catch (err) {
    const errName = (err as Error).name;
    if (errName === 'ValidationError') return res.status(400).send({ message: 'Некорректные данные' });
    return res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
};

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json({ cards });
  } catch (err) {
    return res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
};

export const getCardById = async (req: Request, res: Response) => {
  try {
    const id = req.params.cardId;
    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ message: 'Карточка не найдена.' });
    return res.status(200).json({ card });
  } catch (err) {
    const errorName = (err as Error).name;
    if ((errorName === 'CastError') || (errorName === 'ValidationError')) return res.status(400).json({ message: 'Переданы некорректные данные' });
    return res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
};

export const putLike = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!card) return res.status(404).json({ message: 'Карточки с таким ID не существует' });
    return res.status(201).json({ message: 'Лайк поставлен.' });
  } catch (err) {
    const errorName = (err as Error).name;
    if (errorName === 'CastError') return res.status(400).json({ message: 'Переданы некорректные данные' });
    return res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
};

export const deleteLike = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!card) return res.status(404).json({ message: 'Карточки с таким ID не существует' });
    return res.status(201).json({ message: 'Лайк удален.' });
  } catch (err) {
    const errorName = (err as Error).name;
    if (errorName === 'CastError') return res.status(400).json({ message: 'Переданы некорректные данные' });
    return res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) return res.status(404).json({ message: 'Карточки с таким ID не существует' });
    if(card.owner !== userId) return res.status(403).json({ message: 'Вы не можете удалять чужие карточки' });
    return res.status(201).json({ message: 'Карточка удалена' });
  } catch (err) {
    const errorName = (err as Error).name;
    if (errorName === 'CastError') return res.status(400).json({ message: 'Переданы некорректные данные' });
    return res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
};
