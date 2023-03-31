import * as dotenv from 'dotenv';
dotenv.config();
import {Router, Request, Response} from 'express';
import {json as jsonParser} from 'express';
import {GraphAPI} from './auth/GraphAPI';
const membersRouter = Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const graphAPI = new GraphAPI(
  process.env.GRAPH_API_CLIENT!,
  process.env.GRAPH_API_SECRET!
);

membersRouter.use(jsonParser());

/**
 * @swagger
 * /members/checkStatus/{netID}:
 *  get:
 *   description: Checks whether a member with a NetID is a paid ACM member
 *   parameters:
 *    - in: path
 *      name: netID
 *      required: true
 *      description: The UIUC Network ID of the member to check if the member is paid or not (if member does not exist, it is treated as unpaid member)
 *      schema:
 *        type: string
 *   responses:
 *    '200':
 *      description: An indication of whether or not the ACM member is paid.
 *      content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *            netId:
 *             type: string
 *             description: The netID of the member
 *             example: evanmm3
 *            isPaidMember:
 *             type: boolean
 *             description: Whether or not the member is paid
 *             example: true
 *   tags:
 *   - Members Routes
 */
membersRouter.get('/checkStatus/:netID', async (req: Request, res: Response) => {
    var memberStatus = await graphAPI.isPaidMember(req.params.netID);
    return res.send(memberStatus);
  }
);

export {membersRouter};

