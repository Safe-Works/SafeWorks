import { Request, Response } from "express";
import JobContractRepository from "../repositories/JobContractRepository";
import * as admin from 'firebase-admin';

const jobContractRepository = new JobContractRepository();

interface PaginatedResponse {
    jobs: any[];
    total: number;
    currentPage: number;
}
class JobContractController {

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
}

export default JobContractController;