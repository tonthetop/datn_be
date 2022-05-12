import httpStatus from 'http-status';
import {ApiError} from '../utils/ApiError';
import { Account } from '../models';
import { AccountDoc } from '../models/';

/**
 * Create Account
 * @param {AccountDoc} body
 * @returns {Promise<AccountDoc>}
 */
export const createAccount = async (body: any): Promise<AccountDoc> => {
  try {
    if (!(await Account.isEmailTaken(body.email))) {
      const account = await Account.create(body);
      return account;
    }
    throw new Error('account already exists');
  } catch (err: any) {
    throw new Error(err.message);
  }
};

/**
 * Get Account by id
 * @param {string} id
 * @returns {Promise<AccountDoc>}
 */
export const getAccountById = async (
  id: string
): Promise<AccountDoc> => {
     const account= await Account.findById(id);
     if (!account) throw (new ApiError(httpStatus.BAD_REQUEST, "Account not found"))
     return account
};

/**
 * Get Account by email
 * @param {string} email
 * @returns {Promise<AccountDoc|null>}
 */
export async function getAccountByEmail(
  email: string
): Promise<AccountDoc | null> {
  return Account.findOne({ email });
}

/**
 * Update Account by id
 * @param {string} accountId
 * @param {Object} updateBody
 * @returns {Promise<AccountDoc>}
 */
export async function updateAccountById(
  accountId: string,
  updateBody: Object
): Promise<AccountDoc> {
  const account = await getAccountById(accountId);
  Object.assign(account, updateBody);
  await account.save();
  return account;
}

/**
 * Delete Account by id
 * @param {string} accountId
 * @returns {Promise<AccountDoc|null>}
 */
export const deleteAccountById = async (accountId: string): Promise<AccountDoc|null> => {
  const account = await getAccountById(accountId);
  await account.remove();
  return account;
};
