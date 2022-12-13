import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { prisma } from '../libs/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { InternalServerError } from '../errors/InternalServerError';
import { InvalidRequestError } from '../errors/InvalidRequestError';

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
        message: 'user created with sucess.',
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

export function login(req: Request, res: Response) {}
