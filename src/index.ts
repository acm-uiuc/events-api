import * as dotenv from 'dotenv';
dotenv.config();
import express = require('express');
import {Request, Response} from 'express';
import swaggerUi = require('swagger-ui-express');
import swaggerJsDoc = require('swagger-jsdoc');
const app = express();
import pjson = require('../package.json');
import {APIRouter} from './api';
import {membersRouter} from './members';

app.use(express.json());

/**
 * @swagger
 * /healthz:
 *  get:
 *   description: Use to request health of server
 *   responses:
 *    '200':
 *      description: A successful response. Server is up.
 *    '4XX-5XX':
 *      description: A failure response. Server is down.
 *   tags:
 *   - Unauthenticated Routes
 */
app.get('/healthz', (_req: Request, res: Response) => {
  return res.send('Up.');
});
app.get('/', (_req: Request, res: Response) => {
  return res.redirect('/docs/');
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: pjson.description,
      version: pjson.version,
      description: 'API for ACM Events',
    },
    servers: [
      {
        url: 'events-api.rke.acm.illinois.edu',
        description: 'Production Server',
      },
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: [
    './src/schema/*.ts',
    './src/auth/*.ts',
    './src/*.ts',
    './src/swagger.json',
  ],
};

const swaggerDocs = swaggerJsDoc(options);
app.use('/members', membersRouter);
app.use('/api', APIRouter);

app.use('/docs/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running at http://localhost:${process.env.PORT || 8080}`);
});
