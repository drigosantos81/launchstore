const Order = require('../models/Order');
const User = require('../models/User');
LoadProductServices = require('./LoadProductService');

const { formatPrice, date } = require('../../lib/utils');

async function format(order) {
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
};

const LoadService = {
  async load(service, filter) {
    this.filter = filter;
    
    return this[service]()
  },
  async order() {
    try {
      const order = await Order.findOne(this.filter);

      return format(order);
    } catch (error) {
      console.error(error);
    }
  },
  async orders() {
    try {
      const orders = await Order.findAll(this.filter);

      const ordersPromise = orders.map(format);

      return Promise.all(ordersPromise);
    } catch (error) {
      console.error(error);
    }
  },
  format,
}

module.exports = LoadService;