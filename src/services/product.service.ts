import { Product, ProductDoc } from '../models';
import createError from 'http-errors';
import httpStatus from 'http-status';

/**
 * Create item
 * @param {ProductDoc} body
 * @returns {Promise<ProductDoc>}
 */
const create = async (body: ProductDoc): Promise<ProductDoc> => {
  const productExitsName = await Product.findOne({ name: body.name });
  if (productExitsName)
    throw new createError.Conflict('Product Name already exists');
  const product = await Product.create({ ...body });
  return product;
};

const getById = async (id: string) => {
  const item = await Product.findById(id).populate('discountIds');
  if (!item) throw new createError.NotFound();
  return item;
};

const updateById = async (
  productId: string,
  updateBody: any,
  files: any = ''
) => {
  const product = await getById(productId);

  // console.log('FILE: ', files);
  console.log('Body from Client: ', updateBody);
  if (files) {
    if (files.images) {
      const filePath = files.images[0].path.slice(7).replace('\\', '/');
      updateBody.images = filePath;
    }
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

const deleteById = async (productId: string): Promise<ProductDoc | null> => {
  const item = await getById(productId);
  await (Product as any).delete({ _id: item._id });
  return item;
};

/**
 * Delete item by id
 * @param {string} id
 * @returns {Promise<ProductDoc|null>}
 */
const deleteForceById = async (id: string): Promise<ProductDoc | null> => {
  await (Product as any).deleteOne({ _id:id });
  return null;
};

export { create, getById, updateById, deleteById, deleteForceById };
