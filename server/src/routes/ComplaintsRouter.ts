import express, { RequestHandler } from 'express';
import ComplaintsController from '../controllers/ComplaintsController';
import { Joi, celebrate } from 'celebrate';

const complaintsRouter = express.Router();
const complaintsController = new ComplaintsController();

complaintsRouter.post(
    '/complaints',
    celebrate({
        body: Joi.object({
            description: Joi.string().required(),
            title: Joi.string().required(),
            contract_uid: Joi.string().required(),
            applicant: Joi.string().required(),
        })
    }),
    complaintsController.add as RequestHandler
);

complaintsRouter.get(
    '/complaints',
    complaintsController.getAll as RequestHandler
);

complaintsRouter.patch(
    '/complaints/status/:uid',
    complaintsController.updateStatus as RequestHandler
);

complaintsRouter.delete(
    '/complaints/:uid',
    complaintsController.delete as RequestHandler
);

export default complaintsRouter;