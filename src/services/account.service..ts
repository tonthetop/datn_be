import createError from 'http-errors';
import httpStatus from 'http-status';
import { Account,AccountDoc  } from '../models';

/**
 * Create item
 * @param {AccountDoc} body
 * @returns {Promise<AccountDoc>}
 */
export const create = async (body: any): Promise<AccountDoc> => {
  try {
    if (!(await Account.isEmailTaken(body.email))) {
      const item = await Account.create(body);
      return item;
    }
    throw new createError.BadRequest('item already exists');
  } catch (err: any) {
    throw new createError.BadRequest(err.message)
  }
};

/**
 * Get item by id
 * @param {string} id
 * @returns {Promise<AccountDoc>}
 */
export const getById = async (id: string): Promise<AccountDoc> => {
  const item = await Account.findById(id);

  if (!item) throw new createError.NotFound();

  return item;
};

/**
 * Get item by email
 * @param {string} email
 * @returns {Promise<AccountDoc|null>}
 */
export async function getByEmail(email: string): Promise<AccountDoc> {
  const item = await Account.findOne({ email });
  if (!item) throw new createError.NotFound();
  return item;
}

/**
 * Update item by id
 * @param {string} id
 * @param {Object} body
 * @returns {Promise<AccountDoc>}
 */
export async function updateById(
  id: string,
  body: Object
): Promise<AccountDoc> {
  const item = await getById(id);
  console.log(item);
  Object.assign(item, body);
  await item.save();
  return item;
}

/**
 * Delete item by id
 * @param {string} id
 * @returns {Promise<AccountDoc|null>}
 */
export const deleteById = async (
  id: string
): Promise<AccountDoc | null> => {
  const item = await getById(id);
  await item.remove();
  return item;
};
