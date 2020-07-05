const express = require('express');
const routes = express.Router();
const productsController = require('./app/controllers/productController');

routes.get('/', function(req, res) {
    return res.render("layout.njk");
});

routes.get('/products/create', productsController.create);
routes.post('/products', productsController.post);
routes.get('/products/:id/edit', productsController.edit);

// ALIAS
routes.get('/ads/create', function(req, res) {
    return res.redirect("/products/create");
});

module.exports = routes;
