const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const express = require('express');

const app = express();

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Login',
            version: '1.0.0',
            description: 'Documentação da API de login em Node.js',
        },
        servers: [{
            url: 'http://localhost:3000',
            description: 'Servidor Local',
        }, ],
    },
    apis: ['./index.js', './produtos.js'], // Altere aqui para o nome do seu arquivo principal
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(3000, () => console.log('Server running'));