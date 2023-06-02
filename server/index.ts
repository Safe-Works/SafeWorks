import http from 'http';
import App from './src/App';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT ?? 3001;
const hostname = process.env.HOSTNAME ?? 'http://localhost';

App.set("port", port);
const server = http.createServer(App);
server.listen(port, () => {
  console.log(`[server]: SafeWorks server is running at ${hostname}:${port}`);
});

module.exports = App;

/*
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

// Swagger setup
const swaggerFile: any = (process.cwd() + '/swagger.json');
const swaggerData: any = fs.readFileSync(swaggerFile, 'utf8');
const swaggerDocument = JSON.parse(swaggerData);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Server init
app.listen(port, () => {
  console.log(`[server]: SafeWorks server is running at ${hostname}:${port}`);
});
*/