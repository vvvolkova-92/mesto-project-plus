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
    // @ts-ignore
    const owner = req.user._id;
    const card = new Card({
      name,
      link,
      createdAt,
      owner,
    });
    await card.save();
    res.status(201).json({ message: `Карточка с названием ${name} успешно создана.` });
  } catch (err) {
    const errName = (err as Error).name;
    if (errName === 'ValidationError') {
      res.status(400).send({ message: 'Некорректные данные' });
    }
    res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
  return null;
};

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    res.status(200).json({ cards });
  } catch (err) {
    res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
  return null;
};

export const getCardById = async (req: Request, res: Response) => {
  try {
    const id = req.params.cardId;
    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ message: 'Карточка не найдена.' });
    res.status(200).json({ card });
  } catch (err) {
    const errorName = (err as Error).name;
    if ((errorName === 'CastError') || (errorName === 'ValidationError')) res.status(400).json({ message: 'Переданы некорректные данные' });
    res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
  return null;
};

export const putLike = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!card) return res.status(404).json({ message: 'Карточки с таким ID не существует' });
    res.status(201).json({ message: 'Лайк поставлен.' });
  } catch (err) {
    const errorName = (err as Error).name;
    if ((errorName === 'CastError') || (errorName === 'ValidationError')) res.status(400).json({ message: 'Переданы некорректные данные' });
    res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
  return null;
};

export const deleteLike = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!card) return res.status(404).json({ message: 'Карточки с таким ID не существует' });
    res.status(201).json({ message: 'Лайк удален.' });
  } catch (err) {
    const errorName = (err as Error).name;
    if ((errorName === 'CastError') || (errorName === 'ValidationError')) res.status(400).json({ message: 'Переданы некорректные данные' });
    res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
  return null;
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { cardId } = req.params;
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) return res.status(404).json({ message: 'Карточки с таким ID не существует' });
    res.status(201).json({ message: 'Карточка удалена' });
  } catch (err) {
    const errorName = (err as Error).name;
    if ((errorName === 'CastError') || (errorName === 'ValidationError')) res.status(400).json({ message: 'Переданы некорректные данные' });
    res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
  return null;
};
