const express = require('express');
const routes = express.Router();

const OrderController = require('../app/controllers/OrderController');
const { onlyUsers } = require('../app/middlewares/session');

/* ==== CONTROLE DAS VENDAS: CartController ==== */
routes.post('/', onlyUsers, OrderController.post);
routes.get('/', onlyUsers, OrderController.index);

module.exports = routes;