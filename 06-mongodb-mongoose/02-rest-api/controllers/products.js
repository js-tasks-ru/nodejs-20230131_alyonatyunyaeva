const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
const { default: mongoose } = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({subcategory})
  ctx.body = {products: products.map((mapProduct))}
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({})

  ctx.body = {products: products?.map((mapProduct)) || []}
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id

  if(!mongoose.isValidObjectId(productId)){
    ctx.throw(400, 'invalid product id')
  }

  const productList = await Product.find({ _id: productId })
  const product = productList.find(Boolean)
  
  if (!product){
    ctx.throw(404, 'no product')
  }
  ctx.body = {product: mapProduct(product)};
};



