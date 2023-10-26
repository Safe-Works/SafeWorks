import { Request, Response } from "express";
import JobContractRepository from "../repositories/JobContractRepository";
import * as admin from 'firebase-admin';
import Favorites from "../models/Favorites";

const jobContractRepository = new JobContractRepository();

interface PaginatedResponse {
    jobs: any[];
    total: number;
    currentPage: number;
}
class JobContractController {

    async add(req: Request, res: Response): Promise<void> {
        /*
            #swagger.start
            #swagger.path = '/jobcontracts'
            #swagger.method = 'post'
            #swagger.description = 'Endpoint to add a new Job Contract'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['JobContract']
        */
        try {
            /*
                #swagger.parameters['jobContract'] = {
                    in: 'body',
                    description: 'JobContract data to add',
                    required: true,
                    schema: { $ref: "#/definitions/AddJobContract" }
                }
            */
            const jobContract: JobContract = req.body;
            const hasSufficientBalance = await jobContractRepository.verifyUserBalance(jobContract.client.id, jobContract.price);
            if (!hasSufficientBalance) {
                res.status(402).json({ statusCode: 402, error: 'jobContract/insufficient-balance', message: 'Você não possui saldo suficiente' });
                return;
            }
            
            const result = await jobContractRepository.add(jobContract);
            /* 
                #swagger.responses[201] = { 
                    schema: { $ref: "#/definitions/CreatedJobContract" },
                    description: 'Created JobContract UID' 
                } 
            */
            res.status(201).json({ statusCode: 201, jobAd: result })
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to add job contract: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'jobContract/failed-add', message: error.message });
            }
        }
        // #swagger.end
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const jobs = await jobContractRepository.getAll();
            if (jobs) {
                res.status(200).json({ statusCode: 200, jobs: jobs });
            } else {
                res.status(404).json({ statusCode: 404, error: 'jobContract/not-found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to get all job contracts: ', error.message);
                res.status(500).json({ statusCode: 500, error: 'jobContract/failed-getAll', message: error.message });
            }
        }
    }

    async getAllPaginate(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const itemsPerPage = parseInt(req.query.limit as string) || 10;
            let lastDocument: admin.firestore.QueryDocumentSnapshot | undefined = undefined;
            // Caso não seja a primeira página, obtem o último documento da página anterior
            if (page > 1) {
                const previousPageSnapshot = await jobContractRepository.getNextPage(itemsPerPage, lastDocument);
                const previousDocuments = previousPageSnapshot.docs;
                const totalDocuments = previousDocuments.length;
                if (totalDocuments >= itemsPerPage) {
                    lastDocument = previousDocuments[totalDocuments - 1];
                }
            }
            const totalJobsSnapshot = await jobContractRepository.getTotalJobs();
            // Obtem a página atual
            const currentPageSnapshot = await jobContractRepository.getNextPage(itemsPerPage, lastDocument);

            const jobs = currentPageSnapshot.docs.map((doc) => {
                const data = doc.data();
                return { ...data, uid: doc.id };
            });
            const total = totalJobsSnapshot;
            const response: PaginatedResponse = {
                jobs,
                total,
                currentPage: page,
            };
            
            res.status(200).json(response);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to get all paginated job contracts: ', error.message);
                res.status(500).json({ statusCode: 500, error: 'jobContract/failed-getAllPaginate', message: error.message })
            }
        }
    }

    async getAllJobsFromClient(req: Request, res: Response): Promise<void> {
        try {
            const clientUid = req.params.uid;
            const jobs = await jobContractRepository.getAllJobsFromClient(clientUid);
            if (jobs) {
                res.status(200).json({ statusCode: 200, jobs: jobs });
            } else {
                res.status(404).json({ statusCode: 404, error: 'jobContract/not-found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to get all Jobs from User UID: ', error.message);
                res.status(500).json({ statusCode: 500, error: 'jobContract/failed-getAllFromClient', message: error.message })
            }
        }
    }

    async getAllJobsFromWorker(req: Request, res: Response): Promise<void> {
        try {
            const workerUid = req.params.uid;
            const jobs = await jobContractRepository.getAllJobsFromWorker(workerUid);
            if (jobs) {
                res.status(200).json({ statusCode: 200, jobs: jobs });
            } else {
                res.status(404).json({ statusCode: 404, error: 'jobContract/not-found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to get all Jobs from User UID: ', error.message);
                res.status(500).json({ statusCode: 500, error: 'jobContract/failed-getAllFromWorker', message: error.message })
            }
        }
    }

    async finishContract(req: Request, res: Response): Promise<void> {
        try {
            const jobUid = req.params.uid;
            const userType = req.params.user_type;
            const jobs = await jobContractRepository.finishContract(jobUid, userType);
            if (jobs) {
                res.status(200).json({ statusCode: 200, jobs: jobs });
            } else {
                res.status(404).json({ statusCode: 404, error: 'jobContract/not-found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to finish the contract: ', error.message);
                res.status(500).json({ statusCode: 500, error: 'jobContract/failed-finishContract', message: error.message })
            }
        }
    }

    async evaluateJob(req: Request, res: Response): Promise<void> {
        try {
            const evaluation = req.body;
            const result = await jobContractRepository.evaluateJob(evaluation);

            res.status(201).json({ statusCode: 201, evaluation: result });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to evaluate Job: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'evalateJob/failed-add', message: error.message });
            }
        }
    }
}

export default JobContractController;