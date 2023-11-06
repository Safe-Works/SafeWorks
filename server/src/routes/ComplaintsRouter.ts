import express, { RequestHandler } from 'express';
import ComplaintsController from '../controllers/ComplaintsController';

const complaintsRouter = express.Router();
const complaintsController = new ComplaintsController();

complaintsRouter.get('/complaints', complaintsController.getAll as RequestHandler);

complaintsRouter.patch('/complaints/status/:uid', complaintsController.updateStatus as RequestHandler);

export default complaintsRouter;