import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from './routes/UserRouter';
import jobAdRouter from './routes/JobAdRouter';

import { errors } from 'celebrate';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const hostname = process.env.HOSTNAME || 'http://localhost';

// JSON default body config
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('SafeWorks server is running! 🛠️');
});

// CORS origin config
app.use(cors({
  origin: ['http://localhost:4200']
}))

// Routes
app.use('/api', usersRouter, jobAdRouter);

// Default response to another requisitions
app.use((req, res) => {
  res.status(404);
})

// Celebrate error handler middleware
app.use(errors());

// Server init
app.listen(port, () => {
  console.log(`[server]: SafeWorks server is running at ${hostname}:${port}`);
});