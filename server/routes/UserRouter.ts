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
        })
    }),
    (req, res) => {
    const user: User = req.body;
    userRepository.add(user, (token) => {
      if (token) {
        res.status(201).json({ token });
      } else {
        res.status(400).send();
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
        const user:User = req.body;
        userRepository.login(user, (userAuth) => {
            if (userAuth) {
                res.status(201).json({ userAuth });
            } else {
                res.status(400).send();
            }
        })
    })
  
export default usersRouter;