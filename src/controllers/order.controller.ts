import httpStatus from 'http-status';
import {
  orderService,
  accountService,
  productService,
} from '../services/index';
import { Order, ProductDoc } from '../models';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
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
    let { accountId, productList } = req.body;
    const account = await accountService.getById(accountId);
    let listProductOrigin: ProductDoc[] = [];
    if (account) {
      productList = productList.map(async function (item: any) {
        {
          const product = await productService.getById(item.productId);
          // cap nhat product origin
          const productBysize = product.productBySize.find(
            (e) => e.size === item.size
          );
          if (productBysize && productBysize.amount >= item.amount) {
            productBysize.amount -= item.amount;
            listProductOrigin.push(product);
          } else {
            throw new createError.BadRequest(
              'Size not exits or amount too large'
            );
          }
          // cap nhat product order
          item.price = product.price;
          if (product.discountIds.length > 0) {
            item.discountId = product.discountIds[0]._id;
            item.discountValue = product.discountIds[0].value;
            item.discountCode = product.discountIds[0].code;
          }
          return item;
        }
      });
      // cap nhat product orgin vao DB
      productList = await Promise.all(productList);
      const updateProductOrigin = listProductOrigin.map(
        async (item: ProductDoc) => {
          return item.save();
        }
      );
      await Promise.all(updateProductOrigin);
      // tao order vao DB
      const orderStatus = [];
      orderStatus.push({
        status: 'PENDING',
        description: 'Đơn hàng đang chờ xác nhận',
      });
      const item = await orderService.create({
        ...req.body,
        orderStatus: orderStatus,
        productList,
      });
      if (item.orderType === 'COD')
        return res.status(httpStatus.CREATED).send(item);
      else {
        (req as any).order = item;
        return next();
      }
    }
  }
);

export const getByEmailOrPhone = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const { email, phone } = req.body;
    const account = await accountService.getByEmailOrPhone(email, phone);
    const orders = await Order.find({ accountId: account._id })
      .populate('productList.productId', 'name imgList')
      .populate('accountId', 'name phone email');
    // luc nay chi co [] or [orders]
    res.send(orders);
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
