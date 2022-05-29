import httpStatus from 'http-status';
import { discountService } from '../services/index';
import { Discount } from '../models';
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils';

//
export const getAll = catchAsync(async (req: Request, res: Response) => {
  const discounts = await Discount.find({});
  res.status(httpStatus.OK).send(discounts);
});
export const create = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const discount = await discountService.create(req.body);
    return res.status(httpStatus.CREATED).send(discount);
  }
)

export const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const discount = await discountService.getById(req.params.id);
    return res.status(httpStatus.OK).send(discount);
  }
);

export const updateById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const discount = await discountService.updateById(req.params.id, req.body);
    res.send(discount);
  }
);

export const deleteById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await discountService.deleteById(req.params.id);
    return res.status(httpStatus.NO_CONTENT).send();
  }
);
