import { Router } from 'express';

import * as AuthController from './controllers/authController';
import * as MediasController from './controllers/mediasController';

import { validateSchemaMiddleware } from './middlewares/validateSchemaMiddleware';
import { jwtVerifyMiddleware } from './middlewares/jwtVerifyMiddleware';

import { registerSchema } from './schemas/registerSchema';
import { removeMediaFromUserListSchema } from './schemas/removeMediaFromUserListSchema';
import { addMediaToUserListSchema } from './schemas/addMediaToUserListSchema';
import { verifyIfMediaIsInTheUserListSchema } from './schemas/verifyIfMediaIsInTheUserListSchema';
import { getLinkToRecoverPasswordSchema } from './schemas/getLinkToRecoverPasswordSchema';

export const route = Router();

route.post(
  '/users',
  validateSchemaMiddleware(registerSchema),
  AuthController.register
);
route.get('/me', jwtVerifyMiddleware, AuthController.me);
route.get('/login', AuthController.login);
route.get('/logout', jwtVerifyMiddleware, AuthController.logout);
route.post(
  '/forgot-password/get-link',
  validateSchemaMiddleware(getLinkToRecoverPasswordSchema),
  AuthController.getLinkToRecoverPassword
);
route.get('/forgot-password/:id');
route.post('/forgot-password/change-password');

route.get(
  '/my-list/:mediaId',
  validateSchemaMiddleware(verifyIfMediaIsInTheUserListSchema),
  jwtVerifyMiddleware,
  MediasController.verifyIfMediaIsInTheUserList
);
route.get('/my-list', jwtVerifyMiddleware, MediasController.getMyList);
route.post(
  '/my-list/:mediaId',
  validateSchemaMiddleware(addMediaToUserListSchema),
  jwtVerifyMiddleware,
  MediasController.addToMyList
);
route.delete(
  '/my-list/:mediaId',
  validateSchemaMiddleware(removeMediaFromUserListSchema),
  jwtVerifyMiddleware,
  MediasController.removeFromMyList
);
