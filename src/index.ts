import * as dotenv from 'dotenv';
dotenv.config();
import express = require('express');
import {Request, Response} from 'express';

const app = express();
import {APIRouter} from './api';


app.use(express.json());

app.get('/heartbeat', (req: Request, res: Response) => {
  return res.send('Up.');
});

app.use('/api', APIRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running at http://localhost:${process.env.PORT || 8080}`);
});
