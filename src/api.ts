import * as dotenv from 'dotenv';
dotenv.config();
import {Router, Request, Response, NextFunction} from 'express';
import passport = require('passport');
import {bearerStrategy} from './auth/AADBearer';
import {permissions} from './auth/middleware';
import AADTokenInfo from './auth/AADTokenInfo';
import * as mongoose from 'mongoose';
import {json as jsonParser} from 'express';
import EventSchema from './schema/Event';
const APIRouter = Router();

mongoose.connect(process.env.MONGO_URI!);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log('Connection Successful!');
});

APIRouter.use(jsonParser());
APIRouter.use(passport.initialize());
passport.use(bearerStrategy);

APIRouter.use(
  '/private/',
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      'oauth-bearer',
      {
        session: false,
      },
      (err, user, info) => {
        if (err) {
          return res.status(401).json({success: false, error: err.message});
        }
        if (!user) {
          console.warn('Error in auth: ', info);
          return res.status(401).json({error: 'Unauthorized'});
        }
        if (info) {
          const user: AADTokenInfo = info;
          req.authInfo = user;
          return next();
        }
      }
    )(req, res, next);
  }
);

APIRouter.use('/private/', permissions.either.write);

APIRouter.get('/private/ping', (req: Request, res: Response) => {
  return res.json(req.authInfo);
});

APIRouter.post('/private/events/create', (req: Request, res: Response) => {
  const Event = mongoose.model('Event', EventSchema, 'events');
  const event = new Event(req.body);
  event.save((err, doc) => {
    if (err || !doc) {
      return res
        .status(500)
        .json({error: 'Could not save the document.', success: false});
    }
    return res.json({
      error: 'Event created.',
      id: doc._id.toString(),
      success: true,
    });
  });
});

APIRouter.get('/public/events/all', (_req: Request, res: Response) => {
  const Event = mongoose.model('Event', EventSchema, 'events');
  Event.find({}, '-__v', (err: mongoose.Error, doc: mongoose.Document) => {
    if (err || !doc) {
      return res
        .status(500)
        .json({error: 'Could not find the events.', success: false});
    }
    return res.send(doc);
  });
});

APIRouter.get('/public/events/:id', (req: Request, res: Response) => {
  const Event = mongoose.model('Event', EventSchema, 'events');
  Event.findById(
    req.params.id,
    '-__v',
    (err: mongoose.Error, doc: mongoose.Document) => {
      if (err || !doc) {
        return res
          .status(500)
          .json({error: 'Could not find the document.', success: false});
      }
      return res.send(doc);
    }
  );
});

APIRouter.delete('/private/events/:id', (req: Request, res: Response) => {
  const Event = mongoose.model('Event', EventSchema, 'events');
  Event.findByIdAndDelete(
    req.params.id,
    (err: mongoose.Error, doc: mongoose.Document) => {
      if (err || !doc) {
        return res
          .status(500)
          .json({error: 'Could not find the document.', success: false});
      }
      return res.send({success: true, message: `Deleted ${req.params.id}.`});
    }
  );
});

APIRouter.patch('/private/events/:id', (req: Request, res: Response) => {
  const Event = mongoose.model('Event', EventSchema, 'events');
  Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    (err: mongoose.Error, doc: mongoose.Document) => {
      if (err || !doc) {
        return res
          .status(500)
          .json({error: 'Could not find the document.', success: false});
      }
      return res.send({success: true, message: `Updated ${req.params.id}.`});
    }
  );
});

export {APIRouter};
