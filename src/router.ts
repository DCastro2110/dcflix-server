import { Router } from 'express';

import * as AuthController from './controllers/authController';
import * as MediasController from './controllers/mediasController';

import { validateSchemaMiddleware } from './middlewares/validateSchemaMiddleware';
import { jwtVerifyMiddleware } from './middlewares/jwtVerifyMiddleware';

import { registerSchema } from './schemas/registerSchema';
import { removeMediaFromUserListSchema } from './schemas/removeMediaFromUserListSchema';

export const route = Router();

route.post(
  '/users',
  validateSchemaMiddleware(registerSchema),
  AuthController.register
);
route.get('/me', jwtVerifyMiddleware, AuthController.me);
route.get('/login', AuthController.login);
route.get('/logout', jwtVerifyMiddleware, AuthController.logout);

route.get('/my-list', jwtVerifyMiddleware, MediasController.getMyList);
route.post('/my-list', jwtVerifyMiddleware, MediasController.addToMyList);
route.delete(
  '/my-list',
  validateSchemaMiddleware(removeMediaFromUserListSchema),
  jwtVerifyMiddleware,
  MediasController.removeFromMyList
);
