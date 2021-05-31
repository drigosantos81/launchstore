const Cart = require('../../lib/cart');

const LoadProductsService = require('../services/LoadProductService');

module.exports = {
	async index(req, res) {
		try {
			// Pega o carrinho da sessão
			let { cart } = req.session;

			//Gerenciador do carrinho
			cart = Cart.init(cart);

			return res.render("cart/index", { cart });
		}        
		catch(err) {
			console.error(err);
		}
	},

	async addOne(req, res) {
		try {
			// Pegar id do produto
			const { id } = req.params;
			
			const product = await LoadProductsService.load('product', { where: { id }});

			// Pegar o carrinho da sessão
			let { cart } = req.session;
			
			// Adicionar o produto ao carrinho (usando o gerenciador de carrinho)
			cart = Cart.init(cart).addOne(product);

			// Atualizar o carrinho da sessão
			req.session.cart = cart;

			// Redirecionar o usuário para a tela do carrinho
			return res.redirect('/cart');
		}
		catch (err) {
			console.log(err);
		}
	},
	
	async removeOne(req, res) {
		try {
			// Pegar id do produto
			let { id } = req.params;

			// Pegar o carrinho da sessão
			let { cart } = req.session;

			// Se não tiver carrinho, retornar
			if (!cart) {
				return req.redirect('/cart');
			}

			// Iniciar o carrinho removendo o item (gerenciador de carrinho)
			cart = Cart.init(cart).removeOne(id);

			// Atualiza o carrinho, removendo 1 item
			req.session.cart = cart;

			// Redirecionar o usuário para a tela do carrinho
			return res.redirect('/cart');
		} 
		catch (err) {
			console.log(err);
		}
	},

	async delete(req, res) {
		try {
			let { id } = req.params;
			let { cart } = req.session;

			if (!cart) {
				return
			}

			req.session.cart = Cart.init(cart).delete(id); // OU req.session.cart = cart;

			return res.redirect('/cart');
		}
		catch (err) {
			console.log(err);
		}
	}
}