import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import usersRouter from './routes/UserRouter';
import jobAdRouter from './routes/JobAdRouter';
import portfolioRouter from "./routes/PortfolioRouter";
import favoritesRouter from "./routes/FavoritesRouter";
import { errors } from 'celebrate';
import fs from 'fs';

class App {

    public app: express.Application;

    // Swagger imports
    public swaggerFile: any = (process.cwd() + '/swagger.json');
    public swaggerData: any = fs.readFileSync(this.swaggerFile, 'utf8');
    public swaggerDocument = JSON.parse(this.swaggerData);

    constructor() {
        this.app = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(errors());
    }

    private routes(): void {
        // CORS origin config
        this.app.use(cors({
            origin: ['http://localhost:4200', 'https://safe-works.azurewebsites.net'],
        }));

        // Routes
        this.app.get('/', (req: Request, res: Response) => {
            res.send('SafeWorks server is running! 🛠️');
        });
        this.app.use('/api', usersRouter, jobAdRouter, portfolioRouter, favoritesRouter);

        // Swagger Route setup
        const swaggerFile: any = (process.cwd() + '/swagger.json');
        const swaggerData: any = fs.readFileSync(swaggerFile, 'utf8');
        const swaggerDocument = JSON.parse(swaggerData);
        this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        // Handle undefined routes
        this.app.use('*', (req, res) => {
            res.status(404).send("Make sure url is correct!");
        });
        // Celebrate error handler middleware
        this.app.use(errors());
    }

}

export default new App().app;