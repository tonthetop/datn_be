import { catchAsync } from '../utils/catchAsync';
import { accountService, authService } from '../services';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import axios from 'axios';
import uniqid from 'uniqid';
import { transporter } from '../utils';
import { Account } from '../models';
import createHttpError from 'http-errors';

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const account = await authService.loginAccountWithEmailAndPassword(
    email,
    password
  );
  const token = await account.generateAuthToken();
  res.send({ account, token });
});

const logout = catchAsync(async (req, res, next) => {
  // Log account out of the application
  try {
    req.payload.account.tokens = req.payload.account.tokens.filter(
      (token: any) => {
        return token.token != req.payload.token;
      }
    );
    await req.payload.account.save();
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

const logoutAll = catchAsync(async (req, res, next) => {
  try {
    req.payload.account.tokens.splice(0, req.payload.account.tokens.length);
    await req.payload.account.save();
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

const loginWithGoogle = catchAsync(async (req: any, res: any) => {
  const tokenCredential = await req.params.token;
  //get Info user
  const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${tokenCredential}`;
  const result = await axios.get(url);
  const user = {
    email: result.data.email,
    name: result.data.name,
  };
  console.log(user)
  // create user into DB or return item if exits
  const account = await accountService.getAcountOrCreateNew(user);

  const token = await account.generateAuthToken();

  res.send({ account, token });
});

const resetPassword = catchAsync(
  async (req: any, res: any) => {
    // get email
    const email = req.body.email
    const account = await Account.findOne({ email: email })
    if (!account) throw new createHttpError.BadRequest("Account not exits")
    const newPassword = uniqid.process().toUpperCase();
    // generate pass
    account.password = newPassword
    account.save()
    //send mail
    const msg = {
      from: '"The Shoes App" <theShoesApp@example.com>', // sender address
      to: `${account.email}`, // list of receivers
      subject: 'Reset password for your account', // Subject line
      text: `Hello, here is your new password:  ${newPassword}
            Please change the password after you see this!`
    };
    //
    await transporter(msg);
    //
    return res.send("Please check your Email to receive new password!");
  }
)

export { login, logout, logoutAll, loginWithGoogle, resetPassword };
