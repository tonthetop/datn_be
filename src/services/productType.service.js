const httpStatus = require('http-status');
const { ProductType } = require('../models');
const ApiError = require('../utils/ApiError');

const createProductType = async (productTypeBody) => {
  const productType = await ProductType.create(productTypeBody);
  return productType;
};

const getProductTypes = async () => {
  const productTypeList = await ProductType.find();
  return productTypeList;
};

const getProductTypeById = async (id) => {
  return ProductType.findById(id);
};

module.exports = {
  createProductType,
  getProductTypes,
  getProductTypeById,
};
