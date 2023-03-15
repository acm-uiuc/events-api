import * as dotenv from 'dotenv';
dotenv.config();
import express = require('express');
import {Request, Response} from 'express';
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const app = express();
const pjson = require('../package.json')
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
app.get('/healthz', (req: Request, res: Response) => {
  return res.send('Up.');
});

app.use('/api', APIRouter);
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
        description: 'Production Server'
      },
      {
        url: 'http://localhost:8080'
      }
    ],
  },
  apis: [
    './src/schema/*.ts',
    './src/auth/*.ts',
    './src/*.ts',
    './src/swagger.json'
  ],
};

const swaggerDocs = swaggerJsDoc(options);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/members', membersRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running at http://localhost:${process.env.PORT || 8080}`);
});
