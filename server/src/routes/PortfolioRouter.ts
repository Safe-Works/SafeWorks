import express, { RequestHandler } from 'express';
import {celebrate, Joi} from 'celebrate';
import PortfolioController from '../controllers/PortfolioController';

const portfolioRouter = express.Router();
const portfolioController = new PortfolioController();

portfolioRouter.post(
    '/portfolios',
    celebrate({
        body: Joi.object({
            user_uid: Joi.string().required(),
            description: Joi.string().required(),
            years_experience: Joi.number().required(),
        })
    }),
    portfolioController.add as RequestHandler
);

portfolioRouter.post(
    '/portfolios/:uid/certifications',
    celebrate({
        body: Joi.object({
            title: Joi.string().required(),
            description: Joi.string(),
            issue_organization: Joi.string().required(),
            issue_date: Joi.date().required(),
            certification_url: Joi.string().optional().allow(''),
        })
    }),
    portfolioController.addCertification as RequestHandler
);

portfolioRouter.put(
    '/portfolios/:uid',
    celebrate({
        body: Joi.object({
            description: Joi.string(),
            years_experience: Joi.number(),
        })
    }),
    portfolioController.update as RequestHandler
)

portfolioRouter.get(
    '/portfolios/:uid',
    portfolioController.getById as RequestHandler
);

portfolioRouter.delete(
    '/portfolios/:uid/certifications/:id',
    portfolioController.deleteCertification as RequestHandler
)

export default portfolioRouter;