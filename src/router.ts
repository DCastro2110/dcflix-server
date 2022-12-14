import { Router } from 'express';

import * as AuthController from './controllers/authController';
import * as MoviesController from './controllers/moviesController';

import { validateSchemaMiddleware } from './middlewares/validateSchemaMiddleware';
import { jwtVerifyMiddleware } from './middlewares/jwtVerifyMiddleware';

import { registerSchema } from './schemas/registerSchema';
import { removeMovieFromUserListSchema } from './schemas/removeMovieFromUserListSchema';

export const route = Router();

route.post(
  '/users',
  validateSchemaMiddleware(registerSchema),
  AuthController.register
);
route.get('/me', jwtVerifyMiddleware, AuthController.me);
route.get('/login', AuthController.login);
route.get('/logout', jwtVerifyMiddleware, AuthController.logout);

route.get('/my-list', jwtVerifyMiddleware, MoviesController.getMyList);
route.post('/my-list', jwtVerifyMiddleware, MoviesController.addToMyList);
route.delete(
  '/my-list',
  validateSchemaMiddleware(removeMovieFromUserListSchema),
  jwtVerifyMiddleware,
  MoviesController.removeFromMyList
);
