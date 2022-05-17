import httpStatus from 'http-status';
import { productService } from '../services/index';
import { Product } from '../models';
import express, { Request, Response, NextFunction } from 'express';
import * as ErrorCollection from '../errors';
import { catchAsync } from '../utils';

const convertBase64 = (s: string) => {
  return JSON.parse(Buffer.from(s, 'base64').toString());
};

//
export const getAll = catchAsync(async (req: Request, res: Response) => {
  const filter = req.query.filter as string;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const sortBy = req.query.sortBy;
  const skip = (page - 1) * limit;

  console.log(req.query)
  const { size = '', priceRange = undefined, brand = '' } = filter ? convertBase64(filter) : {};
  console.log({ size, priceRange, brand });

  let sort;
  switch (sortBy) {
    case 'min_price':
      sort = { price: 1 };
      break;
    case 'max_price':
      sort = { price: -1 };
      break;
    case 'min_time':
      sort = { createdAt: 1 };
      break;
    case 'max_time':
      sort = { createdAt: -1 };
      break;
    default:
      sort = { createdAt: -1 };
      break;
  }
  const discounts = await Product.find({
    productBySize: {
      $elemMatch: {
        size: size !== '' ? size : { $regex: new RegExp(size, 'i') },
      },
    },
    price: priceRange
      ? { $gt: priceRange?.min, $lt: priceRange?.max }
      : { $gt: 0, $lt: Infinity },
    brand: brand !== '' ? brand : { $regex: new RegExp(brand, 'i') },
  })
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const totalRecords = await Product.count({
    productBySize: {
      $elemMatch: {
        size: size !== '' ? size : { $regex: new RegExp(size, 'i') },
      },
    },
    price: priceRange
      ? { $gt: priceRange?.min, $lt: priceRange?.max }
      : { $gt: 0, $lt: Infinity },
    brand: brand !== '' ? brand : { $regex: new RegExp(brand, 'i') },
  });
  res.status(httpStatus.OK).send(discounts);
});
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const discount = await productService.create(req.body, 'default');
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
      req.body,
      ''
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
