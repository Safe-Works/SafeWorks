import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

//swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger.json');

// Importar o módulo produtos.js
const produtos = require('./produtos.js');
app.use(express.json());


// adicione as linhas abaixo
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Registrar as rotas do módulo produtos.js na aplicação
app.use('/api/produtos', produtos);

app.post('/login', (req, res) => {
  // implementação da autenticação do usuário
});






app.get('/', (req: Request, res: Response) => {
  res.send('SafeWorks server is running! 🛠️');
});

app.listen(port, () => {
  console.log(`[server]: SafeWorks server is running at http://localhost:${port}`);
});