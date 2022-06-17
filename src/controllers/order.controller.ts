import httpStatus from 'http-status';
import {
  orderService,
  accountService,
  productService,
} from '../services/index';
import { Order, Product, ProductDoc } from '../models';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { catchAsync } from '../utils';
import { AnyArray } from 'mongoose';

//
export const getItemsByQueries = catchAsync(
  async (req: Request, res: Response) => {
    const orders = await Order.find({})
      .populate('productList.productId', 'name imgList')
      .populate('accountId', 'name phone email');
    res.status(httpStatus.OK).send(orders);
  }
);
export const getItemsDeleted = catchAsync(
  async (req: Request, res: Response) => {
    const orders = await Order.findDeleted({})
      .populate('productList.productId', 'name imgList')
      .populate('accountId', 'name phone email');
    res.status(httpStatus.OK).send(orders);
  }
);
export const restoreById = catchAsync(async (req: Request, res: Response) => {
  let result = await Order.restore({ _id: req.params.id });
  res.status(httpStatus.OK).send(result);
});
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
      productList = await Promise.all(productList);

      // cap nhat product orgin vao DB
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
      // Cập nhật orderId vào account table:
      accountService.updateById(account._id, {
        orderIds: [...account.orderIds, item._id],
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
export const deleteForceById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await orderService.deleteForceById(req.params.id);
    return res.status(httpStatus.NO_CONTENT).send();
  }
);
//
const getTotalPriceOfADate = async (listOrder: any, option: any) => {
  return await listOrder.reduce(
    async (acc: any, item: any) =>
      (await acc) + (await getTotalPriceOfOrder(item.productList, option)),
    0
  );
};
const getTotalAmountOfOrder = async (carts: any, option: any) => {
  if (option.type === '') {
    return carts.reduce((acc: any, item: any) => {
      return acc + item.amount;
    }, 0);
  } else if (option.type === 'brand') {
    return await carts.reduce(async (acc: any, item: any) => {
      //
      const productInfo = await Product.find({ _id: item.productId._id });
      if (productInfo.length > 0 && productInfo[0].brand === option.value) {
        return (await acc) + item.amount;
      } else return (await acc) + 0;
    }, 0);
  } else if (option.type === 'productType') {
    return await carts.reduce(async (acc: any, item: any) => {
      //
      const productInfo = await Product.find({ _id: item.productId._id });
      if (
        productInfo.length > 0 &&
        productInfo[0].productType === option.value
      ) {
        return (await acc) + item.amount;
      } else return (await acc) + 0;
    }, 0);
  }
};
//
const getTotalAmountOfADate = async (listOrder: any, option: any) => {
  return await listOrder.reduce(
    async (acc: any, item: any) =>
      (await acc) + (await getTotalAmountOfOrder(item.productList, option)),
    0
  );
};
const getTotalPriceOfOrder = async (carts: any, option: any) => {
  if (option.type === '') {
    return carts.reduce((acc: any, item: any) => {
      //
      const discountValue = item.discountValue ? item.discountValue : 0;
      const priceOrigin = item.price * (1 - discountValue / 100) * item.amount;
      return acc + priceOrigin;
    }, 0);
  } else if (option.type === 'brand') {
    return await carts.reduce(async (acc: any, item: any) => {
      //
      const productInfo = await Product.find({ _id: item.productId._id });
      if (productInfo.length > 0 && productInfo[0].brand === option.value) {
        const discountValue = item.discountValue ? item.discountValue : 0;
        const priceOrigin =
          item.price * (1 - discountValue / 100) * item.amount;
        return (await acc) + priceOrigin;
      } else return (await acc) + 0;
    }, 0);
  } else if (option.type === 'productType') {
    return await carts.reduce(async (acc: any, item: any) => {
      //
      const productInfo = await Product.find({ _id: item.productId._id });
      if (
        productInfo.length > 0 &&
        productInfo[0].productType === option.value
      ) {
        const discountValue = item.discountValue ? item.discountValue : 0;
        const priceOrigin =
          item.price * (1 - discountValue / 100) * item.amount;
        return (await acc) + priceOrigin;
      } else return (await acc) + 0;
    }, 0);
  }
};
//
//
export const countRevenue = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //
    const dateRange = (req.query.dateRange as any).split('--');
    const type = req.query.type || '';
    const value = req.query.value || '';
    // const
    const largeDate = new Date(dateRange[1]);
    largeDate.setDate(largeDate.getDate() + 1);
    const result = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(dateRange[0]),
            $lte: largeDate,
          },
          'orderStatus.status': { $in: ['SUCCESS'] },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orderIds: {
            $push: '$_id',
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $lookup: {
          from: 'orders',
          localField: 'orderIds',
          foreignField: '_id',
          as: 'orders_doc',
        },
      },
    ]);

    const dataPromise = result.map(async (item) => {
      return {
        date: item._id,
        totalBill: await getTotalPriceOfADate(item.orders_doc, { type, value }),
        totalAmount: await getTotalAmountOfADate(item.orders_doc, {
          type,
          value,
        }),
      };
    });
    const data = await Promise.all(dataPromise);
    res.send(data);

    // const dataPromise= result.map(async (resultItem)=>{
    //   const listOrderPromise= resultItem.orderIds.map(async(item:any)=>{
    //       return await Order.find({_id:item})
    //   })
    //   const listOrderResult=await Promise.all(listOrderPromise)
    //   return listOrderResult
    // })
    // const resultFinal=await Promise.all(dataPromise)
    //
  }
);
