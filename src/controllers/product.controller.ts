import httpStatus from 'http-status';
import { productService } from '../services/index';
import { Product } from '../models';
import express, { Request, Response, NextFunction } from 'express';
import * as ErrorCollection from '../errors';
import { catchAsync } from '../utils';

//
export const getAll = catchAsync(async (req: Request, res: Response) => {
  const discounts = await Product.find({});
  res.status(httpStatus.OK).send(discounts);
});
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const discount = await productService.create(req.body,"default");
    return res.status(httpStatus.CREATED).send(discount);
  } catch (err: any) {
    next(new ErrorCollection.BadRequestError(err.message));
  }
};

export const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const discount = await productService.getById(req.params.id);
    return res.status(httpStatus.OK).send(discount);
  }
);

export const updateById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const discount = await productService.updateById(
      req.params.id,
      req.body, ""
    );
    res.send(discount);
  }
);

export const deleteById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await productService.deleteById(req.params.id);
    return res.status(httpStatus.NO_CONTENT).send();
  }
);
