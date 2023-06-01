import express, { RequestHandler } from 'express';
import JobAdRepository from '../repositories/JobAdRepository';
import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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

jobAdRouter.post('/job',
    celebrate({
        [Segments.BODY]: Joi.object({
            worker: Joi.array()
                .items(
                    Joi.object({
                        name: Joi.string().required(),
                        id: Joi.string().required(),
                    })
                )
                .required(),
            title: Joi.string().required(),
            description: Joi.string().required(),
            category: Joi.string().required(),
            address: Joi.string().required(),
            price: Joi.number().required(),
            price_type: Joi.string().required(),
            displacement_fee: Joi.number().required(),
            delivery_type: Joi.string().required(),
        }),
    }),
    async (req, res) => {
        try {
            const job = req.body;
            await jobAdRepository.add(job, (error: any, uid: any) => {
                if (!error) {
                    res.status(201).json({ uid });
                } else {
                    console.error("Error adding job advertisement: ", error);
                    return res.status(500).json({ error: "Failed to add job advertisement" });
                }
            });
        } catch (error) {
            console.error("Error adding job advertisement: ", error);
            return res.status(500).json({ error: "Failed to add job advertisement" });
        }
    }
);

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