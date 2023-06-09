import express from 'express';
import Portfolio from '../models/Portfolio';
import PortfolioRepository from '../repositories/PortfolioRepository';
import {celebrate, Joi} from 'celebrate';
import Certification from "../models/Certification";

const portfolioRouter = express.Router();
const portfolioRepository = new PortfolioRepository();

portfolioRouter.post('/portfolio/:userUid',
    celebrate({
        body: Joi.object({
            description: Joi.string().required(),
            years_experience: Joi.number().required(),
        }),
    }),
    (req, res) => {
        const portfolioData: Portfolio = req.body;
        const userUid = req.params.userUid;

        portfolioRepository.add(portfolioData, userUid, (error: any, token: any) => {
            if (error) {
                if (error.code === "auth/email-already-exists") {
                    res.status(409).json({message: "E-mail already exists"});
                } else {
                    res.status(500).send();
                }
            } else {
                res.status(201).json({token});
            }
        });
    });


portfolioRouter.get('/portfolio/:userUid', (req, res) => {
    const userUid = req.params.userUid;
    portfolioRepository.get(userUid, (error: any, portfolio: any) => {
        if (error) {
            console.error("Error getting portfolio from repository. ", error);
            res.status(500).send();
        } else {
            res.status(200).json([portfolio]);
        }
    });
});

portfolioRouter.delete('/portfolio/:userUid/:certification_url', (req, res) => {
    const userUid = req.params.userUid;
    const certification_url = req.params.certification_url;

    portfolioRepository.delete(userUid, certification_url, (error: any) => {
        if (error) {
            console.error("Error deleting portfolio from repository. ", error);
            res.status(500).send();
        } else {
            res.status(200).json({ message: "Portfolio deleted successfully" });
        }
    });
});

portfolioRouter.put('/portfolio/:userUid',
    celebrate({
        body: Joi.object({
            title: Joi.string().required(),
            description: Joi.string(),
            issue_organization: Joi.string().required(),
            issue_date: Joi.date().required(),
            certification_url: Joi.string(),
        }),
    }),
    (req, res) => {
        const certification: Certification = req.body;
        const userUid = req.params.userUid;

        portfolioRepository.update(certification, userUid, (error: any, token: any) => {
            if (error) {
                res.status(500).json({ message: "Failed to update portfolio" });
            } else {
                res.status(200).json({ message: "Portfolio updated successfully" });
            }
        });
    });

export default portfolioRouter;