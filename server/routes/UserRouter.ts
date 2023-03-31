import express from 'express';
import User from '../models/User';
import UserRepository from '../repositories/UserRepository';

const usersRouter = express.Router();
const userRepository = new UserRepository();

usersRouter.post('/users', (req, res) => {
    const user: User = req.body;
    userRepository.add(user, (id) => {
        if (id) {
            res.status(201).send();
        } else {
            res.status(400).send();
        }
    });
});

export default usersRouter;