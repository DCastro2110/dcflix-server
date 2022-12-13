import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { route } from './router';

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(route);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`I'm running at http://localhost:${port}`);
});
