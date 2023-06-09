import express from 'express';
import Portfolio from '../models/Portfolio';
import PortfolioRepository from '../repositories/PortfolioRepository';
import {celebrate, Joi} from 'celebrate';

const portfolioRouter = express.Router();
const portfolioRepository = new PortfolioRepository();

portfolioRouter.post('/portfolio',
    celebrate({
        body: Joi.object({
            description: Joi.string().required().max(200),
        })
    }),
    (req, res) => {
        const portfolio: Portfolio = req.body;
        portfolioRepository.add(portfolio, (error: any, token: any) => {
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


portfolioRouter.get('/portfolio/:uid', (req, res) => {
    const uid = req.params.uid;
    portfolioRepository.get(uid, (error: any, portfolio: any) => {
        if (error) {
            console.error("Error getting portfolio from repository. ", error);
            res.status(500).send();
        } else {
            res.status(200).json(portfolio);
        }
    });
});

portfolioRouter.get('/portfolio', (req, res) => {
    portfolioRepository.getAll((error: any, portfolios: any) => {
        if (error) {
            console.error("Error getting portfolios from repository. ", error);
            res.status(500).send();
        } else {
            res.status(200).json(portfolios);
        }
    });
});

portfolioRouter.delete('/portfolio/:uid', (req, res) => {
    const uid = req.params.uid;
    portfolioRepository.delete(uid, (error: any) => {
        if (error) {
            console.error("Error deleting portfolio from repository. ", error);
            res.status(500).send();
        } else {
            res.status(200).json({ message: "Portfolio deleted successfully" });
        }
    });
});


export default portfolioRouter;