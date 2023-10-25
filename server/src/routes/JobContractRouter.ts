import express, { RequestHandler } from 'express';
import JobContractController from "../controllers/JobContractController";
import { Joi, celebrate } from 'celebrate';
import favoritesRouter from "./FavoritesRouter";

const jobContractRouter = express.Router();
const jobContractController = new JobContractController();

jobContractRouter.post(
    '/jobs', 
    celebrate({
        body: Joi.object({
            worker:
                Joi.object({
                    id: Joi.string().max(28).required(),
                    name: Joi.string().max(50).required(),
                }).required(),
            advertisement:
                Joi.object({
                    title: Joi.string().max(50).required(),
                    id: Joi.string().max(28).required(),
                }).required(),
            client:
                Joi.object({
                    name: Joi.string().max(50).required(),
                    id: Joi.string().max(28).required(),
                }).required(),
            price: Joi.number().required()
        }),
    }),
    jobContractController.add as RequestHandler
);

jobContractRouter.post(
    '/jobs/evaluateJob',
    celebrate({
        body: Joi.object({
            contractUid: Joi.any().required(),
            evaluation: Joi.number().required(),
        })
    }),
    jobContractController.evaluateJob as RequestHandler
);

jobContractRouter.get(
    '/jobs',
    jobContractController.getAll as RequestHandler
);

jobContractRouter.get(
    '/jobs/paginate',
    jobContractController.getAllPaginate as RequestHandler
)

jobContractRouter.get(
    '/jobs/client/:uid',
    jobContractController.getAllJobsFromClient as RequestHandler
);

jobContractRouter.get(
    '/jobs/worker/:uid',
    jobContractController.getAllJobsFromWorker as RequestHandler
);

jobContractRouter.patch(
    '/jobs/finish/:uid/:user_type',
    jobContractController.finishContract as RequestHandler
);

export default jobContractRouter;