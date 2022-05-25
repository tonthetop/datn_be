import httpStatus from 'http-status';
import { accountService } from '../services/index';
import { Account } from '../models';
import { Request, Response, NextFunction } from 'express';
import { catchAsync, transporter } from '../utils';
import createError from 'http-errors';
//
export const getAll = catchAsync(async (req: Request, res: Response) => {
  const accounts = await Account.find({});
  res.status(httpStatus.CREATED).send(accounts);
});
export const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const account = await accountService.create(req.body);
    //send mail
    const msg = {
      from: '"The Movie PBL6 App" <theMovieApp@example.com>', // sender address
      to: `${account.email}`, // list of receivers
      subject: 'Verification for your account', // Subject line
      text: `Hello, thanks for registering on our site.
            Please click the link below to verify your account: 
            http://${req.headers.host}/account/verify-email?token=${account.emailToken}`, // plain text body
    };
    //
    const result = await transporter(msg);
    //
    return res.status(httpStatus.CREATED).send(result);
  }
);

export const verifyEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const account = await Account.findOne({ emailToken: req.query.token });
    if (!account) {
      throw new createError.BadRequest(
        'Token is inValid. Please contact us for assistance'
      );
    }
    account.emailToken = '';
    account.isVerified = true;
    account.save();
    return res.status(200).send({
      message: 'Your account is now verified.',
    });
  }
);

export const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const account = await accountService.getById(req.params.id);
    return res.status(httpStatus.OK).send(account);
  }
);

export const updateById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await accountService.updateById(req.params.id, req.body);
    res.send(user);
  }
);

export const deleteById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await accountService.deleteById(req.params.id);
    return res.status(httpStatus.NO_CONTENT).send();
  }
);
