import express, { RequestHandler } from 'express';
import {celebrate, Joi} from 'celebrate';
import EvaluationController from '../controllers/EvaluationController';

const evaluationRouter = express.Router();
const evaluationController = new EvaluationController();

evaluationRouter.post(
    '/evaluateJob',
    celebrate({
        body: Joi.object({
            contractId: Joi.string().required(),
            evaluation: Joi.number().required(),
        })
    }),
    evaluationController.add as RequestHandler
);

evaluationRouter.get(
    '/favorites/:uid',
    evaluationController.getById as RequestHandler
);

evaluationRouter.delete(
    '/favorites/:userUid/:workerUid',
    evaluationController.delete as RequestHandler
);

export default evaluationRouter;