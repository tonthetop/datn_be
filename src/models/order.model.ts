import mongoose from 'mongoose';
import { AccountDoc } from './account.model';
import { DiscountDoc } from './discount.model';
import { ProductDoc } from './product.model';
import mongooseDelete from 'mongoose-delete';

export interface OrderAttrs {
  accountId: AccountDoc;
  orderType: string;
  deliveryTime: Date;
  deliveryAddress: string;
  receivePhone: string;
  description: string;
  orderStatus: {
    status: string;
    description: string;
  }[];
  productList: {
    productId: ProductDoc;
    discountId: DiscountDoc;
    size: string;
    amount: number;
    price: number;
    discountValue: number;
    discountCode: string;
  }[];
}

export interface OrderDoc extends mongoose.Document {
  accountId: AccountDoc;
  orderType: string;
  deliveryTime: Date;
  deliveryAddress: string;
  receivePhone: string;
  description: string;
  orderStatus: {
    status: string;
    description: string;
    createdAt: Date;
  }[];
  productList: {
    productId: ProductDoc;
    discountId: DiscountDoc;
    size: string;
    amount: number;
    price: number;
    discountValue: number;
    discountCode: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderModel extends mongoose.Model<OrderDoc> {
  [x: string]: any;
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
  orderStatus: [
    {
      status: {
        type: String,
        require: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      description: {
        type: String,
        require: true,
      },
    },
  ],
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
      price: {
        type: Number,
        require: true,
      },
      discountValue: {
        type: Number,
        require: true,
      },
      discountCode: {
        type: String,
        require: true,
      },
      discountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'discounts',
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};
//Add plugin
orderSchema.plugin(mongooseDelete, {
  deleteAt: true,
  overrideMethods: 'all',
});
export const Order = mongoose.model<OrderDoc, OrderModel>(
  'orders',
  orderSchema
);
