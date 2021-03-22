const LoadProductServices = require('../services/LoadProductService');
const User = require('../models/User');

const mailer = require('../../lib/mailer');

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
	async post(req, res) {
    try {
      // PEGAR OS DADOS DO PRODUTO
      const product = await LoadProductServices.load('product', { where: { id: req.body.id }});

      // PEGAR OS DADOS DO VENDEDOR
      const seller = await User.findOne({ where: { id: product.user_id }});

      // PEGAR OS DADOS DO COMPRADOR
      const buyer = await User.findOne({ where: { id: req.session.userId }});

      // ENVIAR E-MAIL COM DADOS DA COMPRA PARA O VENDEDOR
      await mailer.sendMail({
        to: seller.email,
        from: 'no-replay@launchstore.com.br',
        subject: 'Novo pedido de compra',
        html: email(seller, product, buyer)
      });

      // NOTIFICAR O USÁRIO COM MENSAGEM DE SUCESSO
      return res.render('orders/success');
    } catch (error) {
      console.error(error);
      return res.render('orders/error');
    }
  }
}