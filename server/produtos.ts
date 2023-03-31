/**
 * @swagger
 * /produtos:
 *   post:
 *     tags:
 *       - Produtos
 *     summary: Cadastra um novo produto
 *     description: Endpoint para cadastrar um novo produto
 *     requestBody:
 *       description: Objeto JSON com as informações do produto
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produto'
 *     responses:
 *       '201':
 *         description: Produto cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       '400':
 *         description: Dados inválidos
 *       '500':
 *         description: Erro interno no servidor
 */

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Produto:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *         preco:
 *           type: number
 *       required:
 *         - nome
 *         - preco
 */

router.post('/produtos', (req, res) => {
  // implementação da criação de um novo produto
});

module.exports = router;
