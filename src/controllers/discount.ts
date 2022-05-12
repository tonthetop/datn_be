import express, { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Discount } from '../models';
export const getAllDiscount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const discounts = await Discount.find({});
  res.status(httpStatus.OK).send(discounts);
};
export const getDiscountById =async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const discount = await Discount.findOne({ _id: req.params.id });
  if (!discount) {
    res.status(httpStatus.BAD_REQUEST).send('Discount not found');
  }
  res.status(httpStatus.OK).send(discount);
};
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const discount = await Discount.create(req.body);
  res.status(httpStatus.CREATED).send(discount);
};
