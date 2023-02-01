import express = require('express');
import { Router, Request, Response } from "express";
import { EventsRequest } from './EventsRequest';

const APIRouter = Router()

const checkToken = (req: EventsRequest, res: Response, next: any) => {
    const header = req.headers['authorization'];
    try {
        if (typeof header !== 'undefined') {
            const bearer = header.split(' ');
            const token = bearer[1];
            req.token = token;
            return next();
        } else {
            throw new Error("Unauthorized");
        }
    } catch {
        return res.status(403).send("Not authorized.");
    }

};

APIRouter.use(checkToken as express.RequestHandler);

APIRouter.get('/ping', (req: Request, res: Response) => {
    return res.send("Authenticated.");
})

APIRouter.post('/events/create', (req: Request, res: Response) => {
    res.send("Not yet implemented.");
})

APIRouter.get('/events/all', (req: Request, res: Response) => {
    res.send("Not yet implemented.");
})

APIRouter.get('/events/:id', (req: Request, res: Response) => {
    res.send("Not yet implemented.");
})

APIRouter.delete('/events/:id', (req: Request, res: Response) => {
    res.send("Not yet implemented.");
})

export {APIRouter};