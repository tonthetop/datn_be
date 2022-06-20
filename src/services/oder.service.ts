import createError from 'http-errors';
import { AnyArray } from 'mongoose';
import { productService } from '.';
import { Order, OrderDoc, Product } from '../models';
/**
 * Create item
 * @param {OrderDoc} body
 * @returns {Promise<OrderDoc>}
 */
export const create = async (body: any): Promise<OrderDoc> => {
  const item = await Order.create(body);
  return item;
};

/**
 * Get item by id
 * @param {string} id
 * @returns {Promise<OrderDoc>}
 */
export const getById = async (id: string): Promise<OrderDoc> => {
  const item = await Order.findById(id)
    .populate('accountId', 'name phone email')
    .populate('productList.productId', 'name imgList');
  if (!item) throw new createError.NotFound();

  return item;
};

//
const updateAmountOfSize = async (body: any, item: any) => {
  if (
    (body as any).orderStatus &&
    [...(body as any).orderStatus].pop()?.status === 'CANCEL' &&
    item.orderStatus.pop()?.status !== 'CANCEL'
  ) {
    const promiseProductList = item.productList.map(async (product: any) => {
      const productOrigin: any = await productService.getById(
        product.productId._id
      );
      console.log({ productOrigin });
      const productBySizeOrigin = productOrigin.productBySize.find(
        (e: any) => e.size === product.size
      );
      productBySizeOrigin.amount += product.amount;
      return productOrigin.save();
    });
    return Promise.all(promiseProductList);
  }
};
/**
 * Update item by id
 * @param {string} id
 * @param {Object} body
 * @returns {Promise<OrderDoc>}
 */
export async function updateById(id: string, body: Object): Promise<OrderDoc> {
  const item = await getById(id);
  // cap nhat product
  await updateAmountOfSize(body,item);

  Object.assign(item, body);
  await item.save();
  return item;
}

/**
 * Delete item by id
 * @param {string} id
 * @returns {Promise<OrderDoc|null>}
 */
export const deleteById = async (id: string): Promise<OrderDoc | null> => {
  const item = await getById(id);
  await (Order as any).delete({ _id: item._id });
  return item;
};

/**
 * Delete item by id
 * @param {string} id
 * @returns {Promise<OrderDoc|null>}
 */
export const deleteForceById = async (id: string): Promise<OrderDoc | null> => {
  await (Order as any).deleteOne({ _id: id });
  return null;
};
