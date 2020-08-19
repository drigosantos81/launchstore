const express = require('express');
const routes = express.Router();

const multer = require('./app/middlewares/multer');
const productsController = require('./app/controllers/productController');
const HomeController = require('./app/controllers/HomeController');
const SearchController = require('./app/controllers/SearchController');

// HOME
routes.get('/', HomeController.index);

// SEARCH
routes.get('/products/search', SearchController.index);

// PRODUCTS
routes.get('/products/create', productsController.create);
routes.get('/products/:id', productsController.show);
routes.get('/products/:id/edit', productsController.edit);

routes.post('/products', multer.array('photos', 6), productsController.post);
routes.put('/products', multer.array('photos', 6), productsController.put);
routes.delete('/products', productsController.delete);

// ALIAS
routes.get('/ads/create', function(req, res) {
    return res.redirect("/products/create");
});

module.exports = routes;
