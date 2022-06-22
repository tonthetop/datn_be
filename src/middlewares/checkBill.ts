import express, { Request, Response, NextFunction } from "express"
import * as ErrorCollection from "../errors"
import { Product } from "../models"
import { productService } from "../services"
import { catchAsync } from "../utils"
import createError from 'http-errors';

const checkBill = catchAsync(
    async function (req: Request, res: Response, next: NextFunction) {
        const order = req.body
        console.log(order)
        const productListPromise = order.productList.map(async (item: any) => {
            const product = await productService.getById(item.productId)
            // get populate discounts
            const lastestDis = product.discountIds.pop();
            if (lastestDis) {
                if (lastestDis.timeBegin < new Date() && lastestDis.timeEnd > new Date())
                    product.discountIds = [lastestDis];
                else product.discountIds = [];
            }
            const originDiscountValue = product.discountIds[0]?product.discountIds[0].value:undefined
            return product.price === item.price && originDiscountValue === item.discountValue
        })
        const result =(await Promise.all(productListPromise)).every(b => b);
        if (result) next ()
        else {
             throw new createError.BadRequest("Some change with price and discount");
        }

    }
)

export { checkBill }
