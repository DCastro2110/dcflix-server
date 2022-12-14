import { NextFunction, Request, Response } from 'express';

import { prisma } from '../libs/prisma';

import { NoAuthorizationError } from '../errors/NoAuthorizationError';
import { InternalServerError } from '../errors/InternalServerError';

export async function addToMyList(
  req: Request,
  res: Response,
  next: NextFunction
) {}

export async function removeFromMyList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.userId) {
    return next(new NoAuthorizationError('Credentials not sent.'));
  }

  try {
    await prisma.media.update({
      where: {
        id: Number(req.params.mediaId as String),
      },
      data: {
        users: {
          delete: {
            id: req.userId,
          },
        },
      },
    });

    await prisma.user.update({
      where: {
        id: req.userId,
      },
      data: {
        listOfMedias: {
          delete: {
            id: Number(req.params.mediaId as String),
          },
        },
      },
    });

    res.status(200).json({
      message: 'Movie remove from user list with success.',
      statusCode: 200,
    });
  } catch (err) {
    next(new InternalServerError());
  }
}

export async function getMyList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.userId) {
    return next(new NoAuthorizationError('Credentials not sent.'));
  }

  try {
    const medias = await prisma.media.findMany({
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
        medias,
      },
    });
  } catch (err) {
    next(new InternalServerError());
  }
}
