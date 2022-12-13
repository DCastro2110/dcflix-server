import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { NoAuthorizationError } from '../errors/NoAuthorizationError';

export function jwtVerifyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.cookies.access_token) {
    return next(new NoAuthorizationError('Authorization token not sent.'));
  }

  const token = req.cookies.access_token;
  try {
    const data = jwt.verify(
      token,
      process.env.JWT_KEY as string
    ) as jwt.JwtPayload;
    req.userId = data.sub;
    return next();
  } catch (err) {
    next(new NoAuthorizationError('JWT is invalid.'));
  }
}
