const LoadProductServices = require('../services/LoadProductService');
const User = require('../models/User');
const Order = require('../models/Order');

const mailer = require('../../lib/mailer');
const Cart = require('../../lib/cart');
const { formatPrice, date } = require('../../lib/utils');

const email = (seller, product, buyer) =>`
  <h2>Olá ${seller.name}</h2>
  <p>Você tem um novo pedido de compra do seu produto.</p>
  <p>Produto: ${product.name}</p>
  <p>Preço: ${product.formattedPrice}</p>
  <p></br></br></p>
  <h3>Dados do comprador</h3>
  <p>Nome: ${buyer.name}</p>
  <p>E-mail: ${buyer.email}</p>
  <p>Endereço: ${buyer.address}</p>
  <p>CEP: ${buyer.cep}</p>
  <p></br></br></p>
  <p><strong>Entre em contato com o comprador para finalizar a venda.</strong></p>
  <p></br></br></p>
  <p>Atenciosamente, Equipe LaunchStrore</p>
`

module.exports = {
  async index(req, res) {
    // PEGAR OS PEDIDOS
    let orders = await Order.findAll({ where: { buyer_id: req.session.userId }});

    const getOrdersPromise = orders.map(async order => {
      // DETALHES DO PRODUTO
      order.product = await LoadProductServices.load('product', {
        where: { id: order.product_id }
      });

      // DETALHES DO COMPRADOR
      order.buyer = await User.findOne({
        where: { id: order.buyer_id}
      });

      // DETALHES DO VENDEDOR
      order.seller = await User.findOne({
        where: { id: order.seller_id}
      });

      // FORMATAÇÃO DO PREÇO
      order.formattedPrice = formatPrice(order.price);
      order.formattedTotal = formatPrice(order.total);

      // FORMATAÇÃO DO STATUS
      const statuses = {
        open: 'Aberto',
        sold: 'Vendido',
        canceled: 'Cancelado'
      }

      order.formattedStatus = statuses[order.status];

      // ATUALIADO EM
      const updatedAt = date(order.updated_at);
      order.formattedUpdateAt = `${order.formattedStatus} em ${updatedAt.day}/${updatedAt.month}/${updatedAt.year} às ${updatedAt.hour}h ${updatedAt.minutes}`;

      return order;
    });

    orders = await Promise.all(getOrdersPromise);

    return res.render('orders/index', { orders });
  },

	async post(req, res) {
    try {
      // PEGAR OS PRODUTOS DO CARRINHO
      const cart = Cart.init(req.session.cart);

      const buyer_id = req.session.userId;
      const filteredItems = cart.items.filter(item => 
        item.product.user_id != req.session.userId);

      // CRIAR O PEDIDO
      const createOrdersPromise = filteredItems.map(async item => {
        let { product, price: total, quantity } = item;
        const { price, id: product_id, user_id: seller_id } = product;
        const status = "open";
        const order = await Order.create({
          seller_id,
          buyer_id,
          product_id,
          price,
          total,
          quantity,
          status
        });

         // PEGAR OS DADOS DO PRODUTO
        product = await LoadProductServices.load('product', { where: { id: product_id }});

        // PEGAR OS DADOS DO VENDEDOR
        const seller = await User.findOne({ where: { id: seller_id }});

        // PEGAR OS DADOS DO COMPRADOR
        const buyer = await User.findOne({ where: { id: buyer_id }});

        // ENVIAR E-MAIL COM DADOS DA COMPRA PARA O VENDEDOR
        await mailer.sendMail({
          to: seller.email,
          from: 'no-replay@launchstore.com.br',
          subject: 'Novo pedido de compra',
          html: email(seller, product, buyer)
        });

        return order;
      });

      await Promise.all(createOrdersPromise);

      // LIMPAR CARRINHO
      delete req.session.cart;
      Cart.init();

      // NOTIFICAR O USÁRIO COM MENSAGEM DE SUCESSO
      return res.render('orders/success');
    } catch (error) {
        console.error(error);
        return res.render('orders/error');
    }
  }
}