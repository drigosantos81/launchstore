const LoadProductServices = require('../services/LoadProductService');

module.exports = {
	async index(req, res) {
		try {
			const AllProducts = await LoadProductServices.load('products');
			const products = AllProducts;
			// .filter((product, index) => index > 2 ? false : true);
			
			console.log('PRODUCTS: ', products);
			console.log('PRODUCTS.STATUS: ', products.status);
			console.log('PRODUCTS.IMG: ', products.img);
			console.log('PRODUCTS.files: ', products.files);

			return res.render("home/index", { products });
		}        
		catch(err) {
			console.error(err);
		}
	}
}