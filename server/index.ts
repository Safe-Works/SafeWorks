import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('SafeWorks server is running! 🛠️');
});

app.listen(port, () => {
  console.log(`[server]: SafeWorks server is running at http://localhost:${port}`);
});