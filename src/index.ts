import * as dotenv from 'dotenv'
dotenv.config()
import express = require('express');
import { Request, Response } from "express";
import mongoose = require('mongoose');

const app = express();

// mongoose.connect(process.env.MONGO_URI!);

app.use(express.json());

interface EventsRequest extends Request {
    token: string,
    headers: Record<string, string>,
  }

const checkToken = (req: EventsRequest, res: Response, next: any) => {
  const header = req.headers['authorization'];
  if(typeof header !== 'undefined') {
    const bearer = header.split(' ');
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.status(403).send("Not authorized.");
  }
};

app.get('/heartbeat', (req: Request, res: Response) => {
  res.send("Up.");
})

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running at http://localhost:${process.env.PORT || 8080}`);
});