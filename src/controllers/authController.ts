import { NextFunction, Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { prisma } from '../libs/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { jwtGenerator } from '../providers/jwtGenerator';
import { sendEmail } from '../providers/nodemailerConfig';

import { recoverPasswordTemplate } from '../templates/recoverPasswordTemplate';

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

    const token = jwtGenerator({
      sub: user.id,
      name: user.name,
      email: user.email,
    });

    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(201)
      .json({
        message: 'User created with success.',
        statusCode: 201,
        data: {
          token,
          user: {
            email: user.email,
            id: user.id,
            name: user.name,
          },
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

export async function me(req: Request, res: Response, next: NextFunction) {
  if (!req.userId) {
    return next(new NoAuthorizationError('Credentials not sent.'));
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });

    if (!user?.id) {
      return next(new InvalidRequestError('User not found.'));
    }

    res.status(200).json({
      message: 'User data was sent with success.',
      statusCode: 200,
      data: {
        user: {
          email: user.email,
          id: user.id,
          name: user.name,
        },
      },
    });
  } catch (err) {
    next(new InternalServerError());
  }
}

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

    const token = jwtGenerator({
      sub: user.id,
      name: user.name,
      email: user.email,
    });

    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        message: 'Logged with success.',
        statusCode: 200,
        data: {
          token,
          user: {
            email: user.email,
            id: user.id,
            name: user.name,
          },
        },
      });
  } catch (err) {
    next(new InternalServerError());
  }
}

export function logout(req: Request, res: Response, next: NextFunction) {
  if (!req.userId) {
    return next(new NoAuthorizationError('Credentials not sent.'));
  }
  res.clearCookie('access_token').status(200).json({
    message: 'Logged out with success.',
    statusCode: 200,
  });
}

export async function getLinkToRecoverPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        idToRecoverPassword: true,
      },
    });

    if (!user) {
      return next(new InvalidRequestError('User not found.'));
    }

    if (user.idToRecoverPassword) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          idToRecoverPassword: {
            delete: true,
          },
        },
      });
    }

    const now = new Date().getTime();
    const expiresIn = String(now + 3600000);

    const idToRecoverPassword = await prisma.idToRecoverPassword.create({
      data: {
        expiresIn,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    const mailOptions = {
      to: user.email,
      subject: 'Recuperação de senha - DCFlix',
      html: recoverPasswordTemplate(idToRecoverPassword.id),
    };
    const isErrorInSendEmailRequest = await sendEmail(mailOptions);

    if (isErrorInSendEmailRequest) {
      return next(new InternalServerError());
    }

    res.status(200).json({
      message: 'E-mail send with success',
      statusCode: 200,
    });
  } catch (err) {
    next(new InternalServerError());
  }
}

export async function verifyIfRecoverPasswordIdIsValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  try {
    const idToRecoverPassword = await prisma.idToRecoverPassword.findUnique({
      where: {
        id,
      },
    });

    if (!idToRecoverPassword) {
      return next(new InvalidRequestError('Id not found.'));
    }

    if (parseInt(idToRecoverPassword.expiresIn) < new Date().getTime()) {
      await prisma.idToRecoverPassword.delete({
        where: {
          id,
        },
      });
      return next(new InvalidRequestError('The id has expired.'));
    }

    res.status(200).json({
      message: 'Id for recover password is valid.',
      statusCode: 200,
    });
  } catch (err) {
    next(new InternalServerError());
  }
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { password: passwordNoHash } = req.body;

  const password = bcrypt.hashSync(passwordNoHash, 10);

  try {
    const idToRecoverPassword = await prisma.idToRecoverPassword.findUnique({
      where: {
        id,
      },
    });

    if (!idToRecoverPassword) {
      return next(new InvalidRequestError('Id not found.'));
    }

    if (parseInt(idToRecoverPassword.expiresIn) < new Date().getTime()) {
      await prisma.idToRecoverPassword.delete({
        where: {
          id,
        },
      });
      return next(new InvalidRequestError('The id has expired.'));
    }

    await prisma.user.update({
      where: {
        id: idToRecoverPassword.userId,
      },
      data: {
        password,
      },
    });

    await prisma.idToRecoverPassword.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: 'Password was changed with success.',
      statusCode: 200,
    });
  } catch (err) {
    next(new InternalServerError());
  }
}
