import * as dotenv from 'dotenv';
dotenv.config();
import { Router, Request, Response } from "express";
import {json as jsonParser} from 'express';
import {GraphAPI} from "./auth/GraphAPI";
const membersRouter = Router();

const graphAPI = new GraphAPI(process.env.GRAPH_API_CLIENT!, process.env.GRAPH_API_SECRET!);

membersRouter.use(jsonParser());
membersRouter.get('/checkStatus/:netID', async (req: Request, res: Response) => {
    var memberStatus = await graphAPI.isPaidMember(req.params.netID);
    return res.send(memberStatus);
})

export {membersRouter};