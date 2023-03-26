import {Types} from "mongoose";

export interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

export interface ICard {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
}

export interface IPrError extends Error {
  statusCode: number;
}

export interface IToken {
  _id: string;
  iat: number;
  exp: number;
}