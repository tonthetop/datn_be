import createError from 'http-errors';
import { Order, OrderDoc } from '../models';
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

/**
 * Update item by id
 * @param {string} id
 * @param {Object} body
 * @returns {Promise<OrderDoc>}
 */
export async function updateById(id: string, body: Object): Promise<OrderDoc> {
  const item = await getById(id);
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
  await (Order as any).deleteOne( { _id: id });
  return null;
};
