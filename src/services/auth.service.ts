import {accountService} from '.'
import {AccountDoc} from '../models'
import * as ErrorCollection from '../errors'

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<AccountDoc>}
 */
const loginAccountWithEmailAndPassword = async (email:string, password:string): Promise<AccountDoc> => {
  const user = await accountService.getByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ErrorCollection.NotAuthorizedError();
  }
  return user;
};


export  {
  loginAccountWithEmailAndPassword,

};
