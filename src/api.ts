import { Router, Request, Response } from "express";
import passport = require('passport');
import { bearerStrategy } from './auth/AADBearer';
import { permissions } from './auth/middleware';
import AADTokenInfo from "./auth/AADTokenInfo";

const APIRouter = Router()

APIRouter.use(passport.initialize());
passport.use(bearerStrategy);
APIRouter.use('/private/', (req: Request, res: Response, next: any) => {
    passport.authenticate('oauth-bearer', {
        session: false
    }, (err, user, info) => {
        if (err) {
            return res.status(401).json({success: false, error: err.message})
        }
        if (!user) {
            console.warn("Error in auth: ", info);
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (info) {
            const user: AADTokenInfo = info;
            req.authInfo = user;
            return next();
        }
    })(req, res, next);
})

APIRouter.use('/private/', permissions.either.write)

APIRouter.get('/private/ping', (req: Request, res: Response) => {
    return res.json(req.authInfo);
})

APIRouter.post('/private/events/create', (req: Request, res: Response) => {
    res.send("Not yet implemented.");
})

APIRouter.get('/public/events/all', (req: Request, res: Response) => {
    res.send("Not yet implemented.");
})

APIRouter.get('/public/events/:id', (req: Request, res: Response) => {
    res.send("Not yet implemented.");
})

APIRouter.delete('/private/events/:id', (req: Request, res: Response) => {
    res.send("Not yet implemented.");
})

export {APIRouter};