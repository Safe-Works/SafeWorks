import express, { RequestHandler } from 'express';
import JobContractController from "../controllers/JobContractController";

const jobContractRouter = express.Router();
const jobContractController = new JobContractController();

jobContractRouter.get(
    '/jobs',
    jobContractController.getAll as RequestHandler
);

jobContractRouter.get(
    '/jobs/paginate',
    jobContractController.getAllPaginate as RequestHandler
)

export default jobContractRouter;