import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete';

export interface DiscountAttrs {
  code: string;
  value: number;
  timeBegin: Date;
  timeEnd: Date;
}

export interface DiscountDoc extends mongoose.Document {
  code: string;
  value: number;
  timeBegin: Date;
  timeEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscountModel extends mongoose.Model<DiscountDoc> {
  build(attrs: DiscountAttrs): DiscountDoc;
}

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    require: true,
  },
  value: {
    type: Number,
    require: true,
  },
  timeBegin: {
    type: Date,
    require: true,
  },
  timeEnd: {
    type: Date,
    require: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

discountSchema.statics.build = (attrs: DiscountAttrs) => {
  return new Discount(attrs);
};
//Add plugin
discountSchema.plugin(mongooseDelete, {
  deleteAt: true,
  overrideMethods: 'all',
});

export const Discount = mongoose.model<DiscountDoc, DiscountModel>(
  'discounts',
  discountSchema
);
