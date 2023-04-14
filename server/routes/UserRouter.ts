import express from 'express';
import User from '../models/User';
import UserRepository from '../repositories/UserRepository';
import { celebrate, Joi } from 'celebrate';

const usersRouter = express.Router();
const userRepository = new UserRepository();

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
        const acessToken:string = req.header('acessToken') || '';
        userRepository.login(user, acessToken, (userAuth) => {
            if (userAuth) {
                res.status(201).json({ userAuth });
            } else {
                res.status(400).send();
            }
        })
    })

export default usersRouter;