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
        /*
            #swagger.start
            #swagger.path = '/jobs'
            #swagger.method = 'post'
            #swagger.description = 'Endpoint to add a new JobAd'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['JobAd']
        */
        try {
            /*
                #swagger.parameters['jobAd'] = {
                    in: 'body',
                    description: 'JobAd data to add',
                    required: true,
                    schema: { $ref: "#/definitions/AddJobAd" }
                }
            */
            const jobAd: JobAdvertisement = req.body;
            /*
                #swagger.parameters['files'] = {
                    in: 'formData',
                    type: 'file',
                    description: 'Images file to upload with the JobAd data',
                    required: true
                }
            */
            const photos = req.files;
            const result = await jobAdRepository.add(jobAd, photos);
            /* 
                #swagger.responses[201] = { 
                    schema: { $ref: "#/definitions/CreatedJobAd" },
                    description: 'Created JobAd UID' 
                } 
            */
            res.status(201).json({ statusCode: 201, jobAd: result })
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to add job advertisement: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'jobAd/failed-add', message: error.message });
            }
        }
        // #swagger.end
    }

    async update(req: Request, res: Response): Promise<void> {
        /*
            #swagger.start
            #swagger.path = '/jobs'
            #swagger.method = 'put'
            #swagger.description = 'Endpoint to update a JobAd'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['JobAd']
        */
        try {
            /*
                #swagger.parameters['job'] = {
                    in: 'body',
                    description: 'JobAd data to update',
                    required: true,
                    schema: { $ref: "#/definitions/AddJobAd" }
                }
            */
            const job: JobAdvertisement = req.body;
            /*
                #swagger.parameters['files'] = {
                    in: 'formData',
                    type: 'file',
                    description: 'Images file to upload with the JobAd data',
                    required: true
                }
            */
            const photos = req.files;
            const result = await jobAdRepository.update(job, photos);
            /* 
                #swagger.responses[201] = { 
                    schema: { $ref: "#/definitions/CreatedJobAd" },
                    description: 'Updated JobAd UID' 
                } 
            */
            res.status(201).json({ statusCode: 201, jobAd: result });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to update job advertisement: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'jobAd/failed-update', message: error.message });
            }
        }
        // #swagger.end
    }

    async getById(req: Request, res: Response): Promise<void> {
        /*
            #swagger.start
            #swagger.path = '/jobs/{uid}'
            #swagger.method = 'get'
            #swagger.description = 'Endpoint to get a JobAd by ID'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['JobAd']
        */
        try {
            /*
                #swagger.parameters['uid'] = { 
                    in: 'path',
                    description: 'JobAd UID',
                    required: true
                }
            */
            const jobId = req.params.uid;
            const job = await jobAdRepository.getById(jobId);

            if (job) {
                /* 
                    #swagger.responses[200] = { 
                        schema: { $ref: "#/definitions/JobAd" },
                        description: 'JobAd response object' 
                    } 
                */
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
        // #swagger.end
    }

    async getAll(req: Request, res: Response): Promise<void> {
        /*
            #swagger.start
            #swagger.path = '/jobs'
            #swagger.method = 'get'
            #swagger.description = 'Endpoint to get all JobAds'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['JobAd']
        */
        try {
            /*
                #swagger.parameters['page'] = { 
                    in: 'query',
                    description: 'Page number',
                    required: true,
                    type: 'int'
                }
            */
            const page = parseInt(req.query.page as string) || 1;
            /*
                #swagger.parameters['limit'] = { 
                    in: 'query',
                    description: 'Number of items per page',
                    required: true,
                    type: 'int'
                }
            */
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
            /* 
                #swagger.responses[200] = { 
                    schema: { $ref: "#/definitions/AllJobAds" },
                    description: 'All found JobAds' 
                } 
            */
            res.status(200).json(response);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to get all job advertisements: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'jobAd/failed-getAll', message: error.message });
            }
        }
        // #swagger.end
    }

    async getByWorker (req: Request, res: Response): Promise<void> {
        /*
            #swagger.start
            #swagger.path = '/jobs/worker/{uid}'
            #swagger.method = 'get'
            #swagger.description = 'Endpoint to get all JobAds from a Worker'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['JobAd']
        */
        try {
            /*
                #swagger.parameters['page'] = { 
                    in: 'query',
                    description: 'Page number',
                    required: true,
                    type: 'int'
                }
            */
            const page = parseInt(req.query.page as string) || 1;
            /*
                #swagger.parameters['limit'] = { 
                    in: 'query',
                    description: 'Number of items per page',
                    required: true,
                    type: 'int'
                }
            */
            const itemsPerPage = parseInt(req.query.limit as string) || 10;
            /*
                #swagger.parameters['uid'] = { 
                    in: 'path',
                    description: 'Worker User UID',
                    required: true
                }
            */
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
            /* 
                #swagger.responses[200] = { 
                    schema: { $ref: "#/definitions/AllJobAds" },
                    description: 'All found JobAds' 
                } 
            */
            res.status(200).json(response);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to get job advertisements by worker: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'jobAd/failed-getByWorker', message: error.message });
            }
        }
        // #swagger.end
    }

    async findByTerm(req: Request, res: Response): Promise<void> {
        /*
            #swagger.start
            #swagger.path = '/jobs/find/{term}'
            #swagger.method = 'get'
            #swagger.description = 'Endpoint to get find JobAds by term'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['JobAd']
        */
        try {
            /*
                #swagger.parameters['term'] = { 
                    in: 'path',
                    description: 'Term to search',
                    required: true
                }
            */
            const term = req.params.term;
            const jobs = await jobAdRepository.findByTerm(term);
            if (jobs.length === 0) {
                res.status(404).json({ statusCode: 404, jobs: jobs });
            } else {
                /* 
                    #swagger.responses[200] = { 
                        schema: { $ref: "#/definitions/AllJobAds" },
                        description: 'All found JobAds' 
                    } 
                */
                res.status(200).json({ statusCode: 200, jobs: jobs });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error to find job advertisement by term: ", error.message);
                res.status(500).json({ statusCode: 500, error: 'jobAd/failed-findByTerm', message: error.message });
            }
        }
        // #swagger.end
    }

    async delete(req: Request, res: Response): Promise<void> {
        /*
            #swagger.start
            #swagger.path = '/jobs'
            #swagger.method = 'delete'
            #swagger.description = 'Endpoint to delete a JobAd'
            #swagger.produces = ["application/json"]
            #swagger.tags = ['JobAd']
        */
        try {
            /*
                #swagger.parameters['uid'] = { 
                    in: 'path',
                    description: 'JobAd UID',
                    required: true
                }
            */
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