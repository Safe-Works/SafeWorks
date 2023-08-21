import express, { RequestHandler } from 'express';
import {celebrate, Joi} from 'celebrate';
import FavoritesController from '../controllers/FavoritesController';

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

export default favoritesRouter;