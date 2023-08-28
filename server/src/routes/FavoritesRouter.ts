import express, { RequestHandler } from 'express';
import {celebrate, Joi} from 'celebrate';
import FavoritesController from '../controllers/FavoritesController';
import jobAdRouter from "./JobAdRouter";

const favoritesRouter = express.Router();
const favoritesController = new FavoritesController();

favoritesRouter.post(
    '/favorites',
    celebrate({
        body: Joi.object({
            userUid: Joi.string().required(),
            workerUid: Joi.string().required(),
        })
    }),
    favoritesController.add as RequestHandler
);

favoritesRouter.get(
    '/favorites/:uid',
    favoritesController.getById as RequestHandler
);

favoritesRouter.delete(
    '/favorites/:userUid/:workerUid',
    favoritesController.delete as RequestHandler
);

export default favoritesRouter;