const Product = require('../models/Product');

const { formatPrice, date } = require('../../lib/utils');

async function getImages(productId) {  
    let files = await Product.files(productId);
    files = files.map(file => ({
      ...file,
      src: `//${file.path.replace('public', '')}`
    }));

    // let file = files[0];
    // try {
    //   file = files[0].replace(/\\/g, '/');
    // } catch (error) {
    //   console.log(error);
    // }

  return files;

//   async function getImage(productId) {
//     let results = await Product.files(productId);
//     const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)
//     let file = files[0]
//     try {
//         file = files[0].replace(/\\/g, '/')
//      } catch {}
//      return file
// }

//
    // placehold.it/500x500?text=Produto sem imagem
    // http://localhost:5000\\images\\1588873344953-images.jpg
    // http://localhost:5000/images/1588873344953-images.jpg

}

async function format(product) {
  const files = await getImages(product.id);
  
  product.img = files[0].src;
  product.files = files;
  product.formattedOldPrice = formatPrice(product.old_price);
  product.formattedPrice = formatPrice(product.price);
  
  const { year, month, day, hour, minutes } = date(product.updated_at);

  product.published = {
    year,
    month,
    day: `${day}/${month}/${year}`,
    hour: `${hour}:${minutes}h`,
    minutes
  }
  
  return product;
};

const LoadService = {
  async load(service, filter) {
    this.filter = filter;
    
    return this[service]()
  },
  async product() {
    try {
      const product = await Product.findOne(this.filter);

      return format(product);
    } catch (error) {
      console.error(error);
    }
  },
  async products() {
    try {
      const products = await Product.findAll(this.filter);
      const productsPromise = products.map(format);

      return Promise.all(productsPromise);
    } catch (error) {
      console.error(error);
    }
  },
  format,
}

module.exports = LoadService;