import { Request, Response, NextFunction } from 'express';
import jwt, {UserIDJwtPayload} from 'jsonwebtoken';
import process from 'process';
import Unauthorized from '../errors/401-Unauthorized';
import {IToken} from "../../types/types";

const { JWT_SECRET } = process.env;
export default async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new Unauthorized('Необходима авторизация');
    }
    const token = req.headers.authorization!.split(' ')[1];
    const isVerifiedToken = <UserIDJwtPayload>jwt.verify(token, JWT_SECRET!);
    if (!isVerifiedToken) throw new Unauthorized('Необходима авторизация');
    req.user = isVerifiedToken;
    return next();
  } catch (err) {
    next(err);
  }
};
