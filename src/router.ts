import { Router } from 'express';

import * as AuthController from './controllers/authController';

export const route = Router();

route.post('users', AuthController.register);
route.get('me', AuthController.me);
route.get('login', AuthController.login);
