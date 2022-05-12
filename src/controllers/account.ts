import httpStatus from 'http-status';
import { accountService } from '../services/index';
import { Account } from '../models';
import express, { Request, Response, NextFunction } from 'express';
import * as ErrorCollection from '../errors';
import { catchAsync } from '../utils';

//
export const getAllAccounts = catchAsync(
  async (req: Request, res: Response) => {
    const accounts = await Account.find({});
    res.status(httpStatus.CREATED).send(accounts);
  }
);
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const account = await accountService.createAccount(req.body);
    return res.status(httpStatus.CREATED).send(account);
  } catch (err: any) {
    next(new ErrorCollection.BadRequestError(err.message));
  }
};

export const getAccountById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const account = await accountService.getAccountById(req.params.id);
    if (account) {
      return res.status(httpStatus.OK).send(account);
    }
  }
);

export const updateAccountInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await accountService.updateAccountById(
      req.params.id,
      req.body
    );
    res.send(user);
  }
);

export const deleteAccount = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
      await accountService.deleteAccountById(req.params.id);
      return res.status(httpStatus.NO_CONTENT).send();
  }
);
