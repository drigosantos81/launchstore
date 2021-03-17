const LoadProductServices = require('../services/LoadProductService');

module.exports = {
	async index(req, res) {
		try {
			const AllProducts = await LoadProductServices.load('products');
			const products = AllProducts.filter((product, index) => index > 2 ? false : true);

			return res.render("home/index", { products });
		}        
		catch(err) {
			console.error(err);
		}
	}
}