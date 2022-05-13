import mongoose from 'mongoose';

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
});

discountSchema.statics.build = (attrs: DiscountAttrs) => {
  return new Discount(attrs);
};

export const Discount = mongoose.model<DiscountDoc, DiscountModel>(
  'discounts',
  discountSchema
);
