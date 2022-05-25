import createError from 'http-errors';
import httpStatus from 'http-status';
import { Account, AccountDoc } from '../models';

/**
 * Create item
 * @param {AccountDoc} body
 * @returns {Promise<AccountDoc>}
 */
export const create = async (body: any): Promise<AccountDoc> => {
  try {
    if (!(await Account.isEmailAndPhoneTaken(body.email, body.phone))) {
      const item = await Account.create(body);
      return item;
    }
    throw new createError.BadRequest('item already exists');
  } catch (err: any) {
    throw new createError.BadRequest(err.message);
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
 * Get item by email or phone
 * @param {string} email
 * @param {string} phone
 * @returns {Promise<AccountDoc|null>}
 */
export async function getByEmailOrPhone(
  email: string,
  phone: string
): Promise<AccountDoc> {
  const item = await Account.findOne({
    email: email ? email : { $regex: new RegExp(email, 'i') },
    phone: phone ? phone : { $regex: new RegExp(phone, 'i') },
  });
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
  if ((body as any).phone) {
    const itemPhone = await Account.findOne({phone: (body as any).phone });
    if (itemPhone) {
      if (item._id.toString() !==itemPhone._id.toString() ) throw new createError.BadRequest('Phone number already exits');
    }
  }
  Object.assign(item, body);
  await item.save();
  return item;
}

/**
 * Delete item by id
 * @param {string} id
 * @returns {Promise<AccountDoc|null>}
 */
export const deleteById = async (id: string): Promise<AccountDoc | null> => {
  const item = await getById(id);
  await (Account as any).delete({ _id: item._id })
  return item;
};