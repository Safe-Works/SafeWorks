import express from 'express';
import User from '../models/User';
import UserRepository from '../repositories/UserRepository';
import { celebrate, Joi } from 'celebrate';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const usersRouter = express.Router();
const userRepository = new UserRepository();

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
    }),
    (req, res) => {
        const user: User = req.body;
        userRepository.add(user, (error: any, token: any) => {
            if (error) {
                if (error.code === "auth/email-already-exists") {
                    res.status(409).json({ message: "E-mail already exists" });
                } else {
                    console.log("Error creating a new user. ", error);
                    res.status(500).send();
                }
            } else {
                res.status(201).json({ token });
            }
        });
    });

usersRouter.post('/users/login',
    celebrate({
        body: Joi.object({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8)
        })
    }),
    (req, res) => {
        const user: User = req.body;
        const acessToken: string = req.header('acessToken') || '';
        userRepository.login(user, acessToken, (customTokenJwt) => {
            if (customTokenJwt) {
                res.status(201).json({ customTokenJwt: customTokenJwt });
            } else {
                res.status(400).send();
            }
        })
    })

usersRouter.post('/users/upload', upload.single('file'),
    async (req, res) => {
        const file = req.file;
        const userUid: string = req.body.uid;
        const fileName = userUid + '_profile_photo';
        if (file) {
            userRepository.uploadUserPhoto(file.path, fileName, (error: any, success: any) => {
                if (success) {
                    console.log('Success image upload ' + success)
                    res.status(200).send(success);
                } else {
                    console.error('Error on image upload ' + error)
                    res.status(400).send(error);
                }
            })
        } else {
            console.error('No file uploaded.')
            res.status(400).send('No file uploaded.');
        }
    })

usersRouter.get('/users/:uid', (req, res) => {
    const uid = req.params.uid;
    userRepository.get(uid, (error: any, user: any) => {
        if (error) {
            console.error("Error getting user from repository. ", error);
            res.status(500).send();
        } else {
            res.status(200).json(user);
        }
    });
});


export default usersRouter;