import { Discount,DiscountDoc } from '../models';
import uniqid from 'uniqid';
import httpStatus from 'http-status';
import createError from 'http-errors';
/**
 * Create item
 * @param {DiscountDoc} body
 * @returns {Promise<DiscountDoc>}
 */
export const create = async (body: any): Promise<DiscountDoc> => {
  try {
    body.code = uniqid.process().toUpperCase();
    const item = await Discount.create(body);
    return item;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

/**
 * Get item by id
 * @param {string} id
 * @returns {Promise<DiscountDoc>}
 */
export const getById = async (id: string): Promise<DiscountDoc> => {
  const item = await Discount.findById(id);
  if (!item) throw new createError.NotFound();
  return item;
};

/**
 * Update item by id
 * @param {string} id
 * @param {Object} body
 * @returns {Promise<DiscountDoc>}
 */
export async function updateById(
  id: string,
  body: Object
): Promise<DiscountDoc> {
  const item = await getById(id);
  console.log(item);
  Object.assign(item, body);
  await item.save();
  return item;
}

/**
 * Delete item by id
 * @param {string} id
 * @returns {Promise<DiscountDoc|null>}
 */
export const deleteById = async (
  id: string
): Promise<DiscountDoc | null> => {
  const item = await getById(id);
  await item.remove();
  return item;
};
