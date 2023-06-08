import express, { RequestHandler } from 'express';
import JobAdRepository from '../repositories/JobAdRepository';
import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import JobAdvertisement from '../models/JobAdvertisement';

const jobAdRouter = express.Router();
const jobAdRepository = new JobAdRepository();

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
            await jobAdRepository.add(job, photos, (error: any, uid: any) => {
                if (!error) {
                    res.status(201).json({ statusCode: 201, uid: uid });
                } else {
                    console.error("Error adding job advertisement: ", error);
                    return res.status(500).json({ statusCode: 500, error: "Failed to add job advertisement" });
                }
            });
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

export default jobAdRouter;