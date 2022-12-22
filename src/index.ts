import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { errorsTreatmentMiddleware } from './middlewares/errorsTreatmentMiddleware';

import { route } from './router';

dotenv.config();

const server = express();

server.set('trust proxy', process.env.NODE_ENV !== 'PRODUCTION');

server.use(cors({ credentials: true, origin: process.env.FRONT_URL }));
server.use(cookieParser());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(route);
server.use(errorsTreatmentMiddleware);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`I'm running at http://localhost:${port}`);
});
