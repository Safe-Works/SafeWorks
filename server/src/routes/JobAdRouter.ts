import express, { RequestHandler } from 'express';
import { celebrate, Joi } from 'celebrate';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import JobAdController from '../controllers/JobAdController';

const jobAdRouter = express.Router();
const jobAdController = new JobAdController();

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
const upload = multer({ storage: storage });

jobAdRouter.post(
    '/jobAds',
    upload.array('photos'),
    celebrate({
        body: Joi.object({
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
    jobAdController.add as RequestHandler
);

jobAdRouter.put(
    '/jobAds',
    upload.array('photos'),
    celebrate({
        body: Joi.object({
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
            uid: Joi.string().required(),
            media: Joi.any(),
            displacement_fee: Joi.number(),
            delivery_time: Joi.number()
        })
    }),
    jobAdController.update as RequestHandler
);

jobAdRouter.get(
    '/jobAds/:uid',
    jobAdController.getById as RequestHandler
);

jobAdRouter.get(
    '/jobAds',
    jobAdController.getAll as RequestHandler
);

jobAdRouter.get(
    '/jobAds/worker/:uid',
    jobAdController.getByWorker as RequestHandler
);

jobAdRouter.get(
    '/jobAds/find/:term',
    jobAdController.findByTerm as RequestHandler
);

jobAdRouter.delete(
    '/jobAds/:uid',
    jobAdController.delete as RequestHandler
);

export default jobAdRouter;