import { Product, ProductDoc } from '../models';
import createError from 'http-errors';
import httpStatus from 'http-status';

/**
 * Create item
 * @param {ProductDoc} body
 * @param {any} files
 * @returns {Promise<ProductDoc>}
 */
const create = async (body: ProductDoc, files: any): Promise<ProductDoc> => {
  console.log('CREATE FILE:', files);
  const listFilePaths = files.map((item: any) =>
    item.link.path.slice(7).replace('\\', '/')
  );
  const product = await Product.create({ ...body, imgList: listFilePaths });
  return product;
};

export const setFilterRegex = (searchQuery: any) => {
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
          $and: [
            { $or: [{ productCode: regex }, { name: regex }] },
            { productTypeId: searchQuery.productTypeId },
          ],
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

const getProducts = async (reqQuery: any) => {
  const searchQuery: any = {};
  if (reqQuery.name) {
    searchQuery.name = reqQuery.name;
  }
  if (reqQuery.typeId) {
    searchQuery.productTypeId = reqQuery.typeId;
  }
  if (reqQuery.categoryId) {
    searchQuery.productCategoryId = reqQuery.categoryId;
  }

  const filterRegex = setFilterRegex(searchQuery);

  const perPage = parseInt(reqQuery.limit) || 8;
  let page = parseInt(reqQuery.page) || 1;
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

const getById = async (id: string) => {
  const item = await Product.findById(id);
  if (!item) throw new createError.NotFound();
  return item;
};

const updateById = async (productId: string, updateBody: any, files: any) => {
  const product = await getById(productId);

  // console.log('FILE: ', files);
  console.log('Body from Client: ', updateBody);
  // console.log('Slide in database: ', product.slideImages);

  if (files) {
    if (files.images) {
      const filePath = files.images[0].path.slice(7).replace('\\', '/');
      updateBody.images = filePath;
    }

    //Filter index change image

    //Slide Image from body is 1 element

    //Replace slide index change
  }
  // console.log('PRODUCT SLIDE', product.slideImages);

  Object.assign(product, updateBody);
  product.markModified('slideImages');
  await product.save();
  console.log('UPDATE PRODUCT', product);

  return product;
};

const deleteById = async (productId: string): Promise<ProductDoc | null> => {
  const product = await getById(productId);
  await product.remove();
  return product;
};

export { create, getProducts, getById, updateById, deleteById };
