const { formatPrice } = require('./utils');

// Carrinho salvo na sessão (req.session)
const Cart = {
  init(oldCart) {
    if (oldCart) {
      this.items = oldCart.items; // => [{ product: {}, price, quantity, formattedPrice }, {}]
      this.total = oldCart.total;
    } else {
      this.items = [];
      this.total = {
        quantity: 0,
        price: 0,
        formattedPrice: formatPrice(0)
      }
    }

    return this;
  },

  // Adicionar 1 item
  addOne(product) {
    // Verifica se o produto já existe no carrinho
    let inCart = this.getCartItem(product.id);

    // Se o produto ainda não existir
    if (!inCart) {
      inCart = {
        product: {
          ...product,
          formattedPrice: formatPrice(product.price)
        },
        quantity: 0,
        price: 0,
        formattedPrice: formatPrice(0)
      }

      this.items.push(inCart);
    }

    // Verifica o estoque(quantity)
    if (inCart.quantity >= product.quantity) {
      return this;
    }

    // Atualiza o item
    inCart.quantity++;
    inCart.price = inCart.product.price * inCart.quantity;
    inCart.formattedPrice = formatPrice(inCart.price);

    // Atualiza o Cart
    this.total.quantity++;
    this.total.price += inCart.product.price;
    this.total.formattedPrice = formatPrice(this.total.price);

    return this;
  },

  // Remover 1 item
  removeOne(productId) {
    // Pegar o item do carrinho
    const inCart = this.getCartItem(productId);

    if (!inCart) {
      return this;
    }

    // Atualiza o item
    inCart.quantity--;
    inCart.price = inCart.product.price * inCart.quantity;
    inCart.formattedPrice = formatPrice(inCart.price);

    // Atualiza o Cart
    this.total.quantity--;
    this.total.price -= inCart.product.price;
    this.total.formattedPrice = formatPrice(this.total.price);

    if (inCart.quantity < 1) {
      this.items = this.items.filter(item => 
          item.product.id != inCart.product.id
        );
      // Versão 1
      // const itemIndex = this.items.indexOf(inCart);
      // this.items.splice(itemIndex, 1);

      return this;
    }

    return this;
  },

  // Deletar todo o item
  delete(productId) {
    const inCart = this.getCartItem(productId);

    // Verifica se existe produtos no carrinho
    if (!inCart) {
      return this;
    }

    // Atualiza a quantidade total do carrinho
    if (this.items.length > 0) {
      this.total.quantity -= inCart.quantity;
      this.total.price -= (inCart.product.price * inCart.quantity);
      this.total.formattedPrice = formatPrice(this.total.price);
    }

    this.items = this.items.filter(item => inCart.product.id != item.product.id);

    return this;
  },

  // DRY => Don't Repeat Yourself!!!
  getCartItem(productId) {
    return this.items.find(item => item.product.id == productId);
  }
}

module.exports = Cart;