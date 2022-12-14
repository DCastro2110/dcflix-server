import { NextFunction, Request, Response } from 'express';

import { prisma } from '../libs/prisma';

import { NoAuthorizationError } from '../errors/NoAuthorizationError';
import { InternalServerError } from '../errors/InternalServerError';

export function addToMyList(req: Request, res: Response, next: NextFunction) {}

export function removeFromMyList(
  req: Request,
  res: Response,
  next: NextFunction
) {}

export async function getMyList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.userId) {
    return next(new NoAuthorizationError('Credentials not sent.'));
  }

  try {
    const movies = await prisma.movie.findMany({
      where: {
        users: {
          every: {
            id: {
              equals: req.userId,
            },
          },
        },
      },
    });

    res.status(200).json({
      message: 'Movies sent with success.',
      statusCode: 200,
      data: {
        movies,
      },
    });
  } catch (err) {
    next(new InternalServerError());
  }
}
