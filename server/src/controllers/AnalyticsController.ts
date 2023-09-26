import { Request, Response } from "express";
import AnalyticsRepository from "../repositories/AnalyticsRepository";
import * as admin from 'firebase-admin';
import JobContractRepository from "../repositories/JobContractRepository";

const analysticsRepository = new AnalyticsRepository();
const jobContractRepository = new JobContractRepository();

interface PaginatedResponse {
    jobs: any[];
    total: number;
    currentPage: number;
}
class AnalyticsController {

    async getAllJobAds(req: Request, res: Response): Promise<void> {
        try {
            const jobAds = await analysticsRepository.getAllJobAds();
            if (jobAds) {
                res.status(200).json({ statusCode: 200, jobs: jobAds });
            } else {
                res.status(404).json({ statusCode: 404, error: 'analytics/not-found-getAllJobAds' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error get all job advertisements on analytics: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'analytics/failed-getAllJobAds', message: error.message })
            }
        }
    };

    async getAllJobs(req: Request, res: Response): Promise<void> {
        try {
            const jobs = await analysticsRepository.getAllJobs();
            if (jobs) {
                res.status(200).json({ statusCode: 200, jobs: jobs });
            } else {
                res.status(404).json({ statusCode: 404, error: 'analytics/not-found-getAllJobs' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error get all job contracts on analytics: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'analytics/failed-getAllJobs', message: error.message })
            }
        }
    };

    async getAllJobsPaginated(req: Request, res: Response): Promise<void> {
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
                console.error("Error get all job contracts paginated on analytics: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'analytics/failed-getAllJobsPaginated', message: error.message });
            }
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await analysticsRepository.getAllUsers();
            if (users) {
                res.status(200).json({ statusCode: 200, users: users });
            } else {
                res.status(404).json({ statusCode: 404, error: 'analytics/not-found-getAllUsers' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error get all users on analytics: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'analytics/failed-getAllUsers', message: error.message })
            }
        }
    };

}

export default AnalyticsController;