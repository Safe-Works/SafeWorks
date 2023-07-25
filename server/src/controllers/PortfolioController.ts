import { Request, Response } from "express";
import PortfolioRepository from "../repositories/PortfolioRepository";
import Portfolio from "../models/Portfolio";
import Certification from "../models/Certification";

const portfolioRepository = new PortfolioRepository();

class PortfolioController {

    async add(req: Request, res: Response): Promise<void> {
        try {
            const portfolio: Portfolio = req.body;
            const result = await portfolioRepository.add(portfolio);

            res.status(201).json({ statusCode: 201, portfolio: result });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to add portfolio: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'portfolio/failed-add', message: error.message });
            }
        }
    }

    async addCertification(req: Request, res: Response): Promise<void> {
        try {
            const uid = req.params.uid;
            const certification: Certification = req.body;
            const portfolio = await portfolioRepository.getById(uid);

            if (portfolio) {
                const result = await portfolioRepository.addCertification(certification, uid);
                res.status(201).json({ statusCode: 201, portfolio: result });
            } else {
                res.status(404).json({ statusCode: 404, error: "portfolio/not-found" });
            }
            
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to add certification on portfolio: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'portfolio/failed-addCertification', message: error.message });
            }
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const uid = req.params.uid;
            const updatedPortfolio = req.body;
            const portfolio = await portfolioRepository.getById(uid);

            if (portfolio) {
                const result = await portfolioRepository.update(updatedPortfolio, uid);
                res.status(201).json({ statusCode: 201, portfolio: result });
            } else {
                res.status(404).json({ statusCode: 404, error: "portfolio/not-found" });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to update Portfolio: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'portfolio/failed-update', message: error.message });
            }
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const portfolioId = req.params.uid;
            const portfolio = await portfolioRepository.getById(portfolioId);

            if (portfolio) {
                res.status(200).json({ statusCode: 200, portfolio: portfolio });
            } else {
                res.status(404).json({ statusCode: 404, error: 'portfolio/not-found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to get Portfolio by id:', error.message);
                res.status(500).json({ statusCode: 500, error: 'portfolio/failed-get', message: error.message });
            }
        }
    }

    async deleteCertification(req: Request, res: Response): Promise<void> {
        try {
            const portfolioId = req.params.uid;
            const certificationId = req.params.id
            const portfolio = await portfolioRepository.getById(portfolioId);
            if (portfolio) {
                const result = await portfolioRepository.deleteCertification(portfolioId, certificationId);
                if (result) {
                    res.status(200).json({ statusCode: 200, message: 'Certification deleted successfully from Portfolio.' });
                } else {
                    res.status(404).json({ statusCode: 404, error: 'certification/not-found' });
                } 
            } else {
                res.status(404).json({ statusCode: 404, error: 'portfolio/not-found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to deleted Certification from Portfolio: ', error.message);
                res.status(500).json({ statusCode: 500, error: 'porfolio/failed-deleteCertification', message: error.message })
            }
        }
    }

}

export default PortfolioController;