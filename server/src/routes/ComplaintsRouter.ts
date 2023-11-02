import express, { RequestHandler } from 'express';
import ComplaintsController from '../controllers/ComplaintsController';

const analyticsRouter = express.Router();
const complaintsController = new ComplaintsController();