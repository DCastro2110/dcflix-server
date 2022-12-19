import { NextFunction, Request, Response } from 'express';

import { prisma } from '../libs/prisma';

import { NoAuthorizationError } from '../errors/NoAuthorizationError';
import { InternalServerError } from '../errors/InternalServerError';

export async function addToMyList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.userId) {
    return next(new NoAuthorizationError('Credentials not sent.'));
  }

  const { body } = req;

  try {
    await prisma.media.upsert({
      where: {
        id: Number(req.params.mediaId as String),
      },
      create: {
        id: Number(req.params.mediaId as String),
        mediaType: body.media_type,
        posterPath: body.poster_path,
        overview: body.overview,
        title: body.title,
        users: {
          connect: {
            id: req.userId,
          },
        },
      },
      update: {
        users: {
          connect: {
            id: req.userId,
          },
        },
      },
    });
    res.status(200).json({
      message: 'Media added to user list with success.',
      statusCode: 200,
    });
  } catch (err) {
    next(new InternalServerError());
  }
}

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
          disconnect: {
            id: req.userId,
          },
        },
      },
    });

    res.status(200).json({
      message: 'Medias removed from user list with success.',
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
          some: {
            id: {
              equals: req.userId,
            },
          },
        },
      },
    });

    res.status(200).json({
      message: 'List of medias of user sent with success.',
      statusCode: 200,
      data: {
        medias: medias.map((media) => ({
          ...media,
          poster_path: media.posterPath,
          media_type: media.mediaType,
          posterPath: undefined,
          mediaType: undefined,
        })),
      },
    });
  } catch (err) {
    next(new InternalServerError());
  }
}

export async function verifyIfMediaIsInTheUserList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.userId) {
    return next(new NoAuthorizationError('Credentials not sent.'));
  }

  try {
    const media = await prisma.media.findUnique({
      where: {
        id: Number(req.params.mediaId as String),
      },
      include: {
        users: {
          where: {
            id: req.userId,
          },
        },
      },
    });

    res.status(200).json({
      message:
        'Verification that the user added this movie to the list successfully made.',
      statusCode: 200,
      data: {
        mediaInTheUserList:
          media?.users && media.users.length > 0 ? true : false,
      },
    });
  } catch (err) {
    next(new InternalServerError());
  }
}
