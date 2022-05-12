const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');
const uniqid = require('uniqid');

const createProduct = async (productBody, files) => {
  const randomId = uniqid.process();
  console.log('CREATE FILE:', files);
  const filePath = files.images[0].path.slice(7).replace('\\', '/');
  const product = await Product.create({ ...productBody, productCode: randomId, images: filePath });
  return product;
};

const setFilterRegex = (searchQuery) => {
  const regex = new RegExp(searchQuery.name, 'i');

  switch (Object.keys(searchQuery).length) {
    case 1: {
      if (searchQuery.name) {
        return { $or: [{ productCode: regex }, { name: regex }] };
      }
      return searchQuery;
    }
    case 2: {
      if (searchQuery.name) {
        return {
          $and: [{ $or: [{ productCode: regex }, { name: regex }] }, { productTypeId: searchQuery.productTypeId }],
        };
      }
    }
    case 3: {
      return {
        $and: [
          { $or: [{ productCode: regex }, { name: regex }] },
          { productTypeId: searchQuery.productTypeId },
          { productCategoryId: searchQuery.productCategoryId },
        ],
      };
    }
    default:
      return null;
  }
};

const getProducts = async (req, res) => {
  const searchQuery = {};
  if (req.query.name) {
    searchQuery.name = req.query.name;
  }
  if (req.query.typeId) {
    searchQuery.productTypeId = req.query.typeId;
  }
  if (req.query.categoryId) {
    searchQuery.productCategoryId = req.query.categoryId;
  }

  const filterRegex = setFilterRegex(searchQuery);

  const perPage = parseInt(req.query.limit) || 8;
  let page = parseInt(req.query.page) || 1;
  const productList = await Product.find(filterRegex)
    .skip(perPage * page - perPage)
    .limit(perPage);

  const totalProduct = await Product.countDocuments(filterRegex);
  const totalPage = Math.ceil(totalProduct / perPage);

  return {
    productList,
    currentPage: page,
    limit: perPage,
    totalProduct,
    totalPage: totalPage,
  };
};

const getProductById = async (id) => {
  return Product.findById(id);
};

const updateProductById = async (productId, updateBody, files) => {
  const product = await getProductById(productId);

  // console.log('FILE: ', files);
  console.log('Body from Client: ', updateBody);
  // console.log('Slide in database: ', product.slideImages);

  if (files) {
    if (files.images) {
      const filePath = files.images[0].path.slice(7).replace('\\', '/');
      updateBody.images = filePath;
    }

    //Filter index change image
    product.slideImages = product.slideImages.length > 0 ? product.slideImages : [null, null, null, null];
    const newSlideIndex = updateBody.slideImages
      ? updateBody.slideIndex.filter((sli) => {
          return updateBody.slideImages === null || (updateBody.slideImages && updateBody.slideImages.indexOf(sli) === -1);
        })
      : updateBody.slideIndex;
    console.log('NEW SLIDE INDEX', newSlideIndex);

    if (updateBody.slideImages && typeof updateBody.slideImages === 'object') {
      //Set index deleted to null
      updateBody.slideImages.forEach((sl) => {
        if (sl !== 'null') {
          product.slideImages[sl] = null;
        }
      });
    }

    //Slide Image from body is 1 element
    if (updateBody.slideImages && updateBody.slideImages.length === 1) {
      product.slideImages[updateBody.slideImages] = null;
    }

    //Replace slide index change
    if (files.slideImages) {
      newSlideIndex.forEach((sl, index) => {
        product.slideImages[sl] = files.slideImages[index].path.slice(7).replace('\\', '/');
      });
    }

    delete updateBody.slideIndex;
    delete updateBody.slideImages;
  }
  // console.log('PRODUCT SLIDE', product.slideImages);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  Object.assign(product, updateBody);
  product.markModified('slideImages');
  await product.save();
  console.log('UPDATE PRODUCT', product);

  return product;
};

const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await product.remove();
  return product;
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
