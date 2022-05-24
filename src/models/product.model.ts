import mongoose from 'mongoose';
import { DiscountDoc } from './discount.model';
import mongooseDelete from 'mongoose-delete';

interface ProductBySize {
  size: string;
  amount: number;
}

export interface ProductAttrs {
  name: string;
  brand: string;
  productType: string;
  imgList: string[];
  price: number;
  description: string;
  discountIds: DiscountDoc[];
  productBySize: ProductBySize[];
}

export interface ProductDoc extends mongoose.Document {
  name: string;
  brand: string;
  productType: string;
  imgList: string[];
  price: number;
  description: string;
  discountIds: DiscountDoc[];
  productBySize: ProductBySize[];
  createdAt: Date;
  updatedAt: Date;

}

export interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  brand: {
    type: String,
    require: true,
  },
  productType: {
    type: String,
    require: true,
  },
  imgList: [
    {
      type: String,
      require: true,
    },
  ],
  price: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  discountIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'discounts',
    },
  ],
  productBySize: [
    {
      size: {
        type: String,
        require: true,
      },
      amount: {
        type: Number,
        require: true,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

});

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};
//Add plugin
productSchema.plugin(mongooseDelete, {
  deleteAt: true,
  overrideMethods: 'all',
});
export const Product = mongoose.model<ProductDoc, ProductModel>(
  'products',
  productSchema
);
