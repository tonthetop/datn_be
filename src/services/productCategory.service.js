const httpStatus = require('http-status');
const { ProductCategory } = require('../models');
const ApiError = require('../utils/ApiError');

const createProductCategory = async (productCategoryBody) => {
  const productCategory = await ProductCategory.create(productCategoryBody);
  return productCategory;
};

const getProductCategories = async (req, res) => {
  const productCategoryList = await ProductCategory.find();
  return productCategoryList;
};

const getProductCategoryById = async (id) => {
  return ProductCategory.findById(id);
};

const getProductCategoriesByTypeId = async (typeId) => {
  console.log('Type Id', typeId);
  const query = { productTypeId: typeId };
  const productCategoryList = await ProductCategory.find(query);
  return productCategoryList;
};
module.exports = {
  createProductCategory,
  getProductCategories,
  getProductCategoryById,
  getProductCategoriesByTypeId,
};
