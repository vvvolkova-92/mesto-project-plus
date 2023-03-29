import { Types } from 'mongoose';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

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

// declare global {
//   namespace Express {
//     interface Request {
//       user: { _id: string | JwtPayload }
//     }
//   }
// }

declare module 'express' {
  export interface IRequest extends Request {
    user: { _id: string | JwtPayload }
  }
}

declare module 'jsonwebtoken' {
  export interface UserIDJwtPayload extends JwtPayload {
    _id: string;
  }
}

export interface IPrError extends Error {
  statusCode: number;
}
