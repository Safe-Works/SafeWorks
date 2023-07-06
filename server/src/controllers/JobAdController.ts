import JobAdRepository from "../repositories/JobAdRepository";
import JobAdvertisement from "../models/JobAdvertisement";
import { Request, Response } from "express";
import * as admin from 'firebase-admin';

const jobAdRepository = new JobAdRepository;

interface PaginatedResponse {
    jobs: any[];
    total: number;
    currentPage: number;
}

class JobAdController {

    async add(req: Request, res: Response): Promise<void> {
        try {
            const jobAd: JobAdvertisement = req.body;
            const photos = req.files;
            const result = await jobAdRepository.add(jobAd, photos);

            res.status(201).json({ statusCode: 201, jobAd: result })
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to add job advertisement: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'jobAd/failed-add', message: error.message });
            }
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const job: JobAdvertisement = req.body;
            const photos = req.files;
            const result = await jobAdRepository.update(job, photos);

            res.status(200).json({ statusCode: 200, jobAd: result });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to update job advertisement: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'jobAd/failed-update', message: error.message });
            }
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const jobId = req.params.uid;
            const job = await jobAdRepository.getById(jobId);

            if (job) {
                res.status(200).json({ statusCode: 200, job: job });
            } else {
                res.status(404).json({ statusCode: 404, error: 'jobAd/not-found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to get job advertisement by id:', error.message);
                res.status(500).json({ statusCode: 500, error: 'jobAd/failed-get', message: error.message });
            }
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const itemsPerPage = parseInt(req.query.limit as string) || 10;
            let lastDocument: admin.firestore.QueryDocumentSnapshot | undefined = undefined;
            // Caso não seja a primeira página, obtem o último documento da página anterior
            if (page > 1) {
                const previousPageSnapshot = await jobAdRepository.getNextPage(itemsPerPage, lastDocument);
                const previousDocuments = previousPageSnapshot.docs;
                const totalDocuments = previousDocuments.length;
                if (totalDocuments >= itemsPerPage) {
                    lastDocument = previousDocuments[totalDocuments - 1];
                }
            }
            const totalJobsSnapshot = await jobAdRepository.getTotalJobs();
            // Obtem a página atual
            const currentPageSnapshot = await jobAdRepository.getNextPage(itemsPerPage, lastDocument);

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
                console.error("Error to get all job advertisements: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'jobAd/failed-getAll', message: error.message });
            }
        }
    }

    async getByWorker (req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const itemsPerPage = parseInt(req.query.limit as string) || 10;
            const workerId = req.params.uid;
            let lastDocument = undefined;

            if (page > 1) {
                const previousPageSnapshot = await jobAdRepository.getNextPageByWorker(
                    workerId,
                    itemsPerPage,
                    lastDocument
                );
                const previousDocuments = previousPageSnapshot.docs;
                const totalDocuments = previousDocuments.length;

                if (totalDocuments >= itemsPerPage) {
                    lastDocument = previousDocuments[totalDocuments - 1];
                }
            }

            const totalJobsSnapshot = await jobAdRepository.getTotalJobsByWorker(workerId);
            const currentPageSnapshot = await jobAdRepository.getNextPageByWorker(
                workerId,
                itemsPerPage,
                lastDocument
            );

            const jobs = currentPageSnapshot.docs.map((doc) => {
                const data = doc.data();
                return { ...data, uid: doc.id };
            });

            const total = totalJobsSnapshot;

            const response = {
                jobs,
                total,
                currentPage: page,
            };

            res.status(200).json(response);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to get job advertisements by worker: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'jobAd/failed-getByWorker', message: error.message });
            }
        }
    }

    async findByTerm(req: Request, res: Response): Promise<void> {
        try {
            const term = req.params.term;
            const jobs = await jobAdRepository.findByTerm(term);
            if (jobs.length === 0) {
                res.status(404).json({ statusCode: 404, jobs: jobs });
            } else {
                res.status(200).json({ statusCode: 200, jobs: jobs });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to find job advertisement by term: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'jobAd/failed-findByTerm', message: error.message });
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const jobId = req.params.uid;
            const job = await jobAdRepository.getById(jobId);
            if (!job) {
                res.status(404).json({ statusCode: 404, error: 'jobAd/not-found' });
            } else {
                await jobAdRepository.deleteJobById(jobId);
                res.status(200).json({ statusCode: 200, message: 'Job deleted successfully' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error to deleted job advertisement: ', error.message);
                res.status(500).json({ statusCode: 500, error: 'jobAd/failed-delete', message: error.message })
            }
        }
    }

}

export default JobAdController;