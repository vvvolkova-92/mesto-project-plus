import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import process from "process";
import Unauthorized from "../errors/401-Unauthorized";
const { JWT_SECRET } = process.env;
export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization!.split(' ')[1];
    if(!token) throw new Unauthorized('Необходима авторизация');
    const isVerifiedToken = jwt.verify(token, JWT_SECRET!);
    if(!isVerifiedToken) throw new Unauthorized('Необходима авторизация');
    req.user._id = isVerifiedToken;
  }
  catch (err) {
    next();
  }
};