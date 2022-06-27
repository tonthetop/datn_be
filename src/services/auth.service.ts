import { accountService } from '.';
import { Account, AccountDoc } from '../models';
import createError from 'http-errors';
import createHttpError from 'http-errors';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<AccountDoc>}
 */
const loginAccountWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<AccountDoc> => {
  const account = await Account.findOne({ email: email })
  if (!account) throw new createHttpError.BadRequest("Account not exits")
  if (account.isVerified===false)
    throw new createError.BadRequest('Your account not yet verified');
  if (!account || !(await account.isPasswordMatch(password))) {
    throw new createError.Unauthorized();
  }
  return account;
};
export { loginAccountWithEmailAndPassword };
