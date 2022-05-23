import mongoose from 'mongoose';
import { AccountDoc } from './account.model';
import { DiscountDoc } from './discount.model';
import { ProductDoc } from './product.model';

export interface OrderAttrs {
  accountId: AccountDoc;
  orderType: string;
  deliveryTime: Date;
  deliveryAddress: string;
  receivePhone: string;
  description: string;
  status: string;
  productList: {
    productId: ProductDoc;
    size: string;
    amount: number;
    discountId: DiscountDoc;
  }[];
}

export interface OrderDoc extends mongoose.Document {
  accountId: AccountDoc;
  orderType: string;
  deliveryTime: Date;
  deliveryAddress: string;
  receivePhone: string;
  description: string;
  status: string;
  productList: {
    productId: ProductDoc;
    size: string;
    amount: number;
    discountId: DiscountDoc;
  }[];
  createdAt: Date;
}

export interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'accounts',
  },
  orderType: {
    type: String,
    require: true,
  },
  deliveryTime: {
    type: Date,
    require: true,
  },
  deliveryAddress: {
    type: String,
    require: true,
  },
  receivePhone: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
  productList: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
      },
      size: {
        type: String,
        require: true,
      },
      amount: {
        type: Number,
        require: true,
      },
      discountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'discounts',
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

export const Order = mongoose.model<OrderDoc, OrderModel>(
  'orders',
  orderSchema
);
