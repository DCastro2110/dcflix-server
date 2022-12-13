import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { prisma } from '../libs/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { InternalServerError } from '../errors/InternalServerError';
import { InvalidRequestError } from '../errors/InvalidRequestError';
import { NoAuthorizationError } from '../errors/NoAuthorizationError';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userData = req.body;
  const password = bcrypt.hashSync(userData.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password,
      },
    });

    const token = jwt.sign(
      { sub: user.id, name: user.name, email: user.email },
      process.env.JWT_KEY as string,
      {
        expiresIn: '7 days',
      }
    );

    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(201)
      .json({
        message: 'User created with success.',
        statusCode: 201,
        data: {
          email: user.email,
          id: user.id,
          name: user.name,
        },
      });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if ((err.code = 'P2002'))
        return next(new InvalidRequestError('E-mail already registered.'));
    }
    next(new InternalServerError());
  }
}

export function me(req: Request, res: Response) {}

export async function login(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return next(new NoAuthorizationError('Credentials not sent.'));
  }

  const [type, authorization] = req.headers.authorization.split(' ');

  if (type !== 'Basic') {
    return next(new NoAuthorizationError('Authorization type is invalid.'));
  }

  const [email, password] = atob(authorization).split(':');

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user?.id) {
      return next(new InvalidRequestError('User not found.'));
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return next(new NoAuthorizationError('Password is wrong.'));
    }

    const token = jwt.sign(
      { sub: user.id, name: user.name, email: user.email },
      process.env.JWT_KEY as string,
      {
        expiresIn: '7 days',
      }
    );

    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        message: 'Logged with success.',
        statusCode: 200,
        data: {
          email: user.email,
          id: user.id,
          name: user.name,
        },
      });
  } catch (err) {
    next(new InternalServerError());
  }
}

export function logout(req: Request, res: Response, next: NextFunction) {
  if(!req.userId) {
    return next(new NoAuthorizationError('Credentials not sent.')); 
  }
  res.clearCookie('access_token').status(200).json({
    message: 'Logged out with success.',
    statusCode: 200
  })
}
