import httpStatus from 'http-status';
import { productService } from '../services/index';
import { Product } from '../models';
import express, { Request, Response, NextFunction } from 'express';
import * as ErrorCollection from '../errors';
import { catchAsync } from '../utils';

const convertBase64 = (s: string) => {
  return JSON.parse(Buffer.from(s, 'base64').toString());
};

const checkDiscountAvailable = (items: any[]) => {
  if (items.length > 0) {
    items = items.map((item) => {
      const lastestDis = item.discountIds.pop();
      if (lastestDis) {
        if (
          lastestDis.timeBegin < new Date() &&
          lastestDis.timeEnd > new Date()
        )
          item.discountIds = [lastestDis];
        else item.discountIds = [];
      }
      return item;
    });
  }
  return items;
};
//
export const getItemsByQueries = catchAsync(
  async (req: Request, res: Response) => {
    const filter = req.query.filter as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const sortBy = req.query.sortBy;
    const type = req.query.type ? (req.query.type as string).toUpperCase() : '';
    const skip = (page - 1) * limit;
    console.log('queries: ', req.query);
    const {
      size = '',
      priceRange = undefined,
      brand = '',
    } = filter ? convertBase64(filter) : {};

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
        sort = {};
        break;
    }
    let items = await Product.find({
      productBySize: {
        $elemMatch: {
          size: size !== '' ? size : { $regex: new RegExp(size, 'i') },
        },
      },
      price: priceRange
        ? { $gt: priceRange?.min, $lt: priceRange?.max }
        : { $gt: 0, $lt: Infinity },
      brand: brand !== '' ? brand : { $regex: new RegExp(brand, 'i') },
      productType: type !== '' ? type : { $regex: new RegExp(type, 'i') },
    })
      .populate('discountIds')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    items = checkDiscountAvailable(items);
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
      productType: type !== '' ? type : { $regex: new RegExp(type, 'i') },
    });

    res.status(httpStatus.OK).send({ totalRecords, items });
  }
);
export const create = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const item = await productService.create(req.body, 'default');
      return res.status(httpStatus.CREATED).send(item);
    } catch (err: any) {
      next(new ErrorCollection.BadRequestError(err.message));
    }
  }
)

export const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const item = await productService.getById(req.params.id);
    // get populate discounts
    const lastestDis = item.discountIds.pop();
    if (lastestDis) {
      if (lastestDis.timeBegin < new Date() && lastestDis.timeEnd > new Date())
        item.discountIds = [lastestDis];
      else item.discountIds = [];
    }
    return res.status(httpStatus.OK).send(item);
  }
);

export const updateById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const item = await productService.updateById(
      req.params.id,
      req.body,
      (req as any).files
    );
    res.send(item);
  }
);

export const deleteById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await productService.deleteById(req.params.id);
    return res.status(httpStatus.NO_CONTENT).send();
  }
);
