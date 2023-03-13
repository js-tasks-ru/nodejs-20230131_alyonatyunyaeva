const Category = require('../models/Category')
const mapCategory = require('../mappers/category')

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({})
  if (!categories) {
    ctx.throw(400, 'No category was found');
  }
  ctx.body = {categories: categories.map(mapCategory)}
};
