const express = require('express');
const routes = express.Router();

const CartController = require('../app/controllers/CartController');

/* ==== LOGIN/LOGOUT: CartController ==== */
routes.get('/', CartController.index);

routes.post('/:id/add-one', CartController.addOne);
routes.post('/:id/remove-one', CartController.removeOne);

module.exports = routes;