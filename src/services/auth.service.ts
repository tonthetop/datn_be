import { accountService } from '.';
import { AccountDoc } from '../models';
import createError from 'http-errors';

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
  const user = await accountService.getByEmailOrPhone(email, '');
  if (!user.isVerified)
    throw new createError.BadRequest('Your account not yet verified');
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new createError.Unauthorized();
  }
  return user;
};
export { loginAccountWithEmailAndPassword};
