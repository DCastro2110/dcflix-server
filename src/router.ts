import { Router } from 'express';

import * as AuthController from './controllers/authController';

import { validateSchemaMiddleware } from './middlewares/validateSchemaMiddleware';
import { errorsTreatmentMiddleware } from './middlewares/errorsTreatmentMiddleware';

import { registerSchema } from './schemas/registerSchema';

export const route = Router();

route.post(
  '/users',
  validateSchemaMiddleware(registerSchema),
  AuthController.register
);
route.get('me', AuthController.me);
route.get('login', AuthController.login);
