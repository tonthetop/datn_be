import httpStatus from 'http-status';
import { orderService, accountService } from '../services/index';
import { Order } from '../models';
import express, { Request, Response, NextFunction } from 'express';
import * as ErrorCollection from '../errors';
import { catchAsync } from '../utils';

//
export const getItemsByQueries = catchAsync(
  async (req: Request, res: Response) => {
    const items = await Order.find({});
    res.status(httpStatus.OK).send({ items });
  }
);
export const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const account = await accountService.getById(req.body.accountId);

    if (account) {
      const item = await orderService.create(req.body);
      return res.status(httpStatus.CREATED).send(item);
    }
  }
);

export const getByEmailOrPhone = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {email='',phone=''}=req.body
    const account = accountService.getByEmailOrPhone(email,phone)
    const item = await orderService.getById(req.params.id);
    return res.status(httpStatus.OK).send(item);
  }
);

export const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const item = await orderService.getById(req.params.id);
    return res.status(httpStatus.OK).send(item);
  }
);

export const updateById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const item = await orderService.updateById(req.params.id, req.body);
    res.send(item);
  }
);

export const deleteById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await orderService.deleteById(req.params.id);
    return res.status(httpStatus.NO_CONTENT).send();
  }
);
