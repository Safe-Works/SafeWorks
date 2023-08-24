import express, { RequestHandler } from 'express';
import AnalyticsController from '../controllers/AnalyticsController';

const analyticsRouter = express.Router();
const analyticsController = new AnalyticsController();

analyticsRouter.get(
    '/analytics/jobAds',
    analyticsController.getAllJobAds as RequestHandler
);

analyticsRouter.get(
    '/analytics/jobs',
    analyticsController.getAllJobs as RequestHandler
);

analyticsRouter.get(
    '/analytics/users',
    analyticsController.getAllUsers as RequestHandler
);

export default analyticsRouter;