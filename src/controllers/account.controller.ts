import httpStatus from 'http-status';
import { accountService } from '../services/index';
import { Account } from '../models';
import express, { Request, Response, NextFunction } from 'express';
import * as ErrorCollection from '../errors';
import { catchAsync } from '../utils';

//
export const getAll = catchAsync(async (req: Request, res: Response) => {
  const accounts = await Account.find({});
  res.status(httpStatus.CREATED).send(accounts);
});
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const account = await accountService.create(req.body);
    return res.status(httpStatus.CREATED).send(account);
  } catch (err: any) {
    next(new ErrorCollection.BadRequestError(err.message));
  }
};

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
