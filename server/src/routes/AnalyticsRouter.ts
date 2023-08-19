import express, { RequestHandler } from 'express';
import AnalyticsController from '../controllers/AnalyticsController';

const analyticsRouter = express.Router();
const analyticsController = new AnalyticsController();