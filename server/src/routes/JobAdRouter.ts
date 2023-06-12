import express, { RequestHandler } from 'express';
import JobAdRepository from '../repositories/JobAdRepository';
import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';
import path, { parse } from 'path';
import fs from 'fs';
import JobAdvertisement from '../models/JobAdvertisement';
import * as admin from 'firebase-admin';
const jobAdRouter = express.Router();
const jobAdRepository = new JobAdRepository();
interface PaginatedResponse {
    jobs: any[];
    total: number;
    currentPage: number;
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "uploads");
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage })

jobAdRouter.post('/job', upload.array('photos'),
    celebrate({
        [Segments.BODY]: Joi.object({
            worker:
                Joi.object({
                    name: Joi.string().max(50).required(),
                    id: Joi.string().max(28).required(),
                }).required(),
            title: Joi.string().max(50).required(),
            description: Joi.string().max(400).required(),
            category:
                Joi.object({
                    name: Joi.string().max(30).required(),
                    id: Joi.number().required(),
                }).required(),
            district:
                Joi.object({
                    name: Joi.string().max(30).required(),
                    id: Joi.number().required(),
                }).required(),
            price: Joi.number().required(),
            price_type:
                Joi.object({
                    name: Joi.string().max(30).required(),
                    id: Joi.number().required(),
                }).required(),
            uid: Joi.any(),
            displacement_fee: Joi.any(),
            delivery_time: Joi.any()
        }),
    }),
    async (req, res) => {
        try {
            const job: JobAdvertisement = req.body;
            const photos = req.files; // Array de arquivos enviados

            const uid = await jobAdRepository.add(job, photos);
            res.status(201).json({ statusCode: 201, uid: uid });
        } catch (error) {
            console.error("Error adding job advertisement: ", error);
            return res.status(500).json({ statusCode: 500, error: "Failed to add job advertisement" });
        }
    });


jobAdRouter.get("/job/find/:term", (async (req, res) => {
    const term = req.params.term;
    try {
        const jobs = await jobAdRepository.findByTerm(term);
        res.status(201).json({ jobs });
    } catch (error) {
        res.status(500).json({ error: 'Failed to find job advertisement' });
    }
}) as RequestHandler);

jobAdRouter.get('/job/get/all', async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const ITEMS_PER_PAGE = parseInt(req.query.limit as string) || 10;

    try {
        let lastDocument: admin.firestore.QueryDocumentSnapshot | undefined = undefined;
        // Caso não seja a primeira página, obtem o último documento da página anterior
        if (page > 1) {
            const previousPageSnapshot = await jobAdRepository.getNextPage(ITEMS_PER_PAGE, lastDocument);
            const previousDocuments = previousPageSnapshot.docs;
            const totalDocuments = previousDocuments.length;
            if (totalDocuments >= ITEMS_PER_PAGE) {
                lastDocument = previousDocuments[totalDocuments - 1];
            }
        }
        const totalJobsSnapshot = await jobAdRepository.getTotalJobs();
        // Obtem a página atual
        const currentPageSnapshot = await jobAdRepository.getNextPage(ITEMS_PER_PAGE, lastDocument);

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
        console.error('Error retrieving job advertisements:', error);
        res.status(500).json({ error: 'Failed to retrieve job advertisements' });
    }
});

jobAdRouter.get('/job/get', async (req, res) => {
    const jobId = req.query.id as string;

    try {
        const job = await jobAdRepository.getJobById(jobId);

        if (job) {
            res.status(200).json({ statusCode: 200, job: job });
        } else {
            res.status(404).json({ statusCode: 404, error: 'Job not found' });
        }
    } catch (error) {
        console.error('Error retrieving job:', error);
        res.status(500).json({ statusCode: 500, error: 'Failed to retrieve job' });
    }
});


jobAdRouter.get('/job/getByWorkerId', async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const ITEMS_PER_PAGE = parseInt(req.query.limit as string) || 10;
    const workerId = req.query.workerId?.toString() || "";

    try {
        let lastDocument = undefined;

        if (page > 1) {
            const previousPageSnapshot = await jobAdRepository.getNextPageByWorker(
                workerId,
                ITEMS_PER_PAGE,
                lastDocument
            );
            const previousDocuments = previousPageSnapshot.docs;
            const totalDocuments = previousDocuments.length;

            if (totalDocuments >= ITEMS_PER_PAGE) {
                lastDocument = previousDocuments[totalDocuments - 1];
            }
        }

        const totalJobsSnapshot = await jobAdRepository.getTotalJobsByWorker(workerId);
        const currentPageSnapshot = await jobAdRepository.getNextPageByWorker(
            workerId,
            ITEMS_PER_PAGE,
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
        console.error('Error retrieving job advertisements:', error);
        res.status(500).json({ error: 'Failed to retrieve job advertisements' });
    }
});


jobAdRouter.delete('/job/delete', async (req, res) => {
    const jobId = req.query.id as string;

    try {
        // Verifica se o job existe antes de removê-lo
        const job = await jobAdRepository.getJobById(jobId);
        if (!job) {
            return res.status(404).json({ statusCode: 404, error: 'Job not found' });
        }

        await jobAdRepository.deleteJobById(jobId);

        res.status(200).json({ statusCode: 200, message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ statusCode: 500, error: 'Failed to delete job' });
    }
});

jobAdRouter.put('/job', upload.array('photos'),
    celebrate({
        [Segments.BODY]: Joi.object({
            worker:
                Joi.object({
                    name: Joi.string().max(50).required(),
                    id: Joi.string().max(28).required(),
                }).required(),
            title: Joi.string().max(50).required(),
            description: Joi.string().max(400).required(),
            category:
                Joi.object({
                    name: Joi.string().max(30).required(),
                    id: Joi.number().required(),
                }).required(),
            district:
                Joi.object({
                    name: Joi.string().max(30).required(),
                    id: Joi.number().required(),
                }).required(),
            price: Joi.number().required(),
            price_type:
                Joi.object({
                    name: Joi.string().max(30).required(),
                    id: Joi.number().required(),
                }).required(),
            uid: Joi.any(),
            media: Joi.any(),
            displacement_fee: Joi.any(),
            delivery_time: Joi.any()
        }),
    }),
    async (req, res) => {
        try {
            const job: JobAdvertisement = req.body;
            const photos = req.files;

            const uid = await jobAdRepository.update(job, photos);
            res.status(200).json({ statusCode: 200, uid: uid });
        } catch (error) {
            console.error("Error updating job advertisement: ", error);
            return res.status(500).json({ statusCode: 500, error: "Failed to update job advertisement" });
        }
    });

export default jobAdRouter;