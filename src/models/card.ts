import { Schema, model } from 'mongoose';
import { ICard } from '../../types/types';

const cardSchema = new Schema<ICard>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    // "Сейчас не возможно создать более одной карточки в базе. Поле не должно быть уникальным." -
    // можно создать сколько-угодно карточек, я проверила. Нельзя поставить больше 1 лайка
    // своей карточке от себя но от разных пользователей больше 1 лайка поставить можно:
    // https://imgur.com/jtoxZPi.png
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'user',
      unique: true,
      index: true,
    }],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export default model<ICard>('Card', cardSchema);
