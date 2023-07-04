import express, { RequestHandler } from 'express';
import { celebrate, Joi } from 'celebrate';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import UserController from '../controllers/UserController';

const usersRouter = express.Router();
const userController = new UserController();

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

usersRouter.post('/users',
    celebrate({
        body: Joi.object({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8),
            name: Joi.string().required().max(50),
            cpf: Joi.string().required().min(11),
            telephone_number: Joi.string().required().min(11),
        })
    }), userController.add as RequestHandler
);

usersRouter.get(
    '/users/:uid',
    userController.getById as RequestHandler
);

usersRouter.put(
    '/users/:uid',
    upload.single('photo'),
    celebrate({
        body: Joi.object({
            email: Joi.string().email(),
            password: Joi.string().min(8),
            name: Joi.string().max(50),
            cpf: Joi.string().min(11),
            telephone_number: Joi.string().min(11),
            username: Joi.string().max(50),
            district: Joi.string().max(255)
        }).min(1) // Pelo menos um campo deve estar presente
    }),
    userController.update as RequestHandler
);

usersRouter.post('/users/login',
    celebrate({
        body: Joi.object({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8)
        })
    }), userController.login as RequestHandler
);

usersRouter.post(
    '/users/upload',
    upload.single('file'), 
    userController.upload as RequestHandler
);

export default usersRouter;