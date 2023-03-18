import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import process from "process";
const { JWT_SECRET } = process.env;
export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization!.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Необходима авторизация' });
    const isVerifiedToken = jwt.verify(token, JWT_SECRET!);
    if(!isVerifiedToken) res.status(401).json({ message: 'Необходима авторизация' });
    req.user._id = isVerifiedToken;
    next();
  }
  catch (err) {
    return res.status(500).json({ message: 'Ошибочка вышла, попробуйте снова.' });
  }
};