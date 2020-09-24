const express = require('express');
const routes = express.Router();

const multer = require('../app/middlewares/multer');
const productsController = require('../app/controllers/productController');
const SearchController = require('../app/controllers/SearchController');

// ========== SEARCH ==========
routes.get('/search', SearchController.index);

// ========== PRODUCTS ==========
routes.get('/create', productsController.create);
routes.get('/:id', productsController.show);
routes.get('/:id/edit', productsController.edit);

routes.post('/', multer.array('photos', 6), productsController.post);
routes.put('/', multer.array('photos', 6), productsController.put);
routes.delete('/', productsController.delete);

module.exports = routes;