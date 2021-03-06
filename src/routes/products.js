const express = require('express');
const routes = express.Router();

const multer = require('../app/middlewares/multer');
const productsController = require('../app/controllers/ProductController');
const SearchController = require('../app/controllers/SearchController');
const { onlyUsers } = require('../app/middlewares/session');
const Valodator = require('../app/validators/product');

// ========== SEARCH ==========
routes.get('/search', SearchController.index);

// ========== PRODUCTS ==========
routes.get('/create', onlyUsers, productsController.create);
routes.get('/:id', productsController.show);
routes.get('/:id/edit', onlyUsers, productsController.edit);

routes.post('/', onlyUsers, multer.array('photos', 6), Valodator.post, productsController.post);
routes.put('/', onlyUsers, multer.array('photos', 6), Valodator.put, productsController.put);
routes.delete('/', onlyUsers, productsController.delete);

module.exports = routes;