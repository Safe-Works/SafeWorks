import { Request, Response } from "express";
import PortfolioRepository from "../repositories/PortfolioRepository";
import Portfolio from "../models/Portfolio";
import Certification from "../models/Certification";

const portfolioRepository = new PortfolioRepository();

class PortfolioController {

    async add(req: Request, res: Response): Promise<void> {
        /*
            #swagger.start
            #swagger.path = '/portfolios'
            #swagger.method = 'post'
            #swagger.description = 'Endpoint to add a new Portfolio'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['Portfolio']
        */
        try {
            /*
                #swagger.parameters['portfolio'] = {
                    in: 'body',
                    description: 'Porfolio data to add',
                    required: true,
                    schema: { $ref: "#/definitions/AddPortfolio" }
                }
            */
            const portfolio: Portfolio = req.body;
            const result = await portfolioRepository.add(portfolio);
            /* 
                #swagger.responses[201] = { 
                    schema: { $ref: "#/definitions/CreatedPorfolio" },
                    description: 'Created Portfolio object' 
                } 
            */
            res.status(201).json({ statusCode: 201, portfolio: result });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to add portfolio: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'portfolio/failed-add', message: error.message });
            }
        }
        // #swagger.end
    }

    async addCertification(req: Request, res: Response): Promise<void> {
        /*
            #swagger.start
            #swagger.path = '/portfolios/{uid}/certifications'
            #swagger.method = 'post'
            #swagger.description = 'Endpoint to add a new Certification on a Portfolio'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['Portfolio']
        */
        try {
            /*
                #swagger.parameters['uid'] = { 
                    in: 'path',
                    description: 'Portfolio UID',
                    required: true
                }
            */
            const uid = req.params.uid;
            /*
                #swagger.parameters['certification'] = {
                    in: 'body',
                    description: 'Certification data to add',
                    required: true,
                    schema: { $ref: "#/definitions/AddCertification" }
                }
            */
            const certification: Certification = req.body;
            const portfolio = await portfolioRepository.getById(uid);

            if (portfolio) {
                const result = await portfolioRepository.addCertification(certification, uid);
                /* 
                    #swagger.responses[201] = { 
                        schema: { $ref: "#/definitions/Porfolio" },
                        description: 'Portfolio object with new Certification' 
                    } 
                */
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
        // #swagger.end
    }

    async update(req: Request, res: Response): Promise<void> {
        /*
            #swagger.start
            #swagger.path = '/portfolios/{uid}'
            #swagger.method = 'put'
            #swagger.description = 'Endpoint to update a Portfolio'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['Portfolio']
        */
        try {
            /*
                #swagger.parameters['uid'] = { 
                    in: 'path',
                    description: 'Portfolio UID',
                    required: true
                }
            */
            const uid = req.params.uid;
            /*
                #swagger.parameters['updatedPortfolio'] = {
                    in: 'body',
                    description: 'Portfolio data to update',
                    required: true,
                    schema: { $ref: "#/definitions/UpdatePortfolio" }
                }
            */
            const updatedPortfolio = req.body;
            const portfolio = await portfolioRepository.getById(uid);

            if (portfolio) {
                const result = await portfolioRepository.update(updatedPortfolio, uid);
                /* 
                    #swagger.responses[200] = { 
                        schema: { $ref: "#/definitions/Porfolio" },
                        description: 'Updated Portfolio object' 
                    } 
                */
                res.status(200).json({ statusCode: 200, portfolio: result });
            } else {
                res.status(404).json({ statusCode: 404, error: "portfolio/not-found" });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to update Portfolio: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'portfolio/failed-update', message: error.message });
            }
        }
        // #swagger.end
    }

    async getById(req: Request, res: Response): Promise<void> {
        /*
            #swagger.start
            #swagger.path = '/portfolios/{uid}'
            #swagger.method = 'get'
            #swagger.description = 'Endpoint to get a Portfolio by UID'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['Portfolio']
        */
        try {
            /*
                #swagger.parameters['uid'] = { 
                    in: 'path',
                    description: 'Portfolio UID',
                    required: true
                }
            */
            const portfolioId = req.params.uid;
            const portfolio = await portfolioRepository.getById(portfolioId);

            if (portfolio) {
                /* 
                    #swagger.responses[200] = { 
                        schema: { $ref: "#/definitions/Porfolio" },
                        description: 'Portfolio object' 
                    } 
                */
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
        // #swagger.end
    }

    async deleteCertification(req: Request, res: Response): Promise<void> {
        /*
            #swagger.start
            #swagger.path = '/portfolios'
            #swagger.method = 'delete'
            #swagger.description = 'Endpoint to get a Certification from Portfolio'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['Portfolio']
        */
        try {
            /*
                #swagger.parameters['uid'] = { 
                    in: 'path',
                    description: 'Portfolio UID',
                    required: true
                }
            */
            const portfolioId = req.params.uid;
            /*
                #swagger.parameters['id'] = { 
                    in: 'path',
                    description: 'Certification ID',
                    required: true
                }
            */
            const certificationId = req.params.id
            const portfolio = await portfolioRepository.getById(portfolioId);
            if (portfolio) {
                const result = await portfolioRepository.deleteCertification(portfolioId, certificationId);
                if (result) {
                    res.status(200).json({ statusCode: 200, portfolio: result, message: 'Certification deleted successfully from Portfolio.' });
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
        // #swagger.end
    }

}

export default PortfolioController;