import express from 'express';
import User from '../models/User';
import UserRepository from '../repositories/UserRepository';

const usersRouter = express.Router();
const userRepository = new UserRepository();

usersRouter.post('/users', (req, res) => {
    const user: User = req.body;
    userRepository.add(user, (token) => {
      if (token) {
        res.status(201).json({ token });
      } else {
        res.status(400).send();
      }
    });
  });
  

export default usersRouter;