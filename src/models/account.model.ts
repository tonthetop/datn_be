import mongoose, { ObjectId } from 'mongoose';
import { OrderDoc } from './order.model';
import validator from 'validator';
import bcrypt from 'bcrypt';
export interface AccountAttrs {
  email: string;
  name: string;
  address: string;
  phone: string;
  birth: Date;
  role: string;
  password: string;
  orderIds: OrderDoc[];
}

export interface AccountDoc extends mongoose.Document {
  isPasswordMatch(password: string):Promise<boolean>;
  email: string;
  name: string;
  address: string;
  phone: string;
  birth: Date;
  role: string;
  password: string;
  orderIds: OrderDoc[];
  createdAt: Date;
}

export interface AccountModel extends mongoose.Model<AccountDoc> {
  isEmailTaken(email: string, excludeaccountId?: string): Promise<boolean>;
  build(attrs: AccountAttrs): AccountDoc;
}

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  name: {
    type: String,
    require: true,
    trim: true,
  },
  address: {
    type: String,
    require: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  birth: {
    type: Date,
    trim: true,
  },
  role: {
    type: String,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
    minlength: 8,
    validate(value: string) {
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new Error(
          'Password must contain at least one letter and one number'
        );
      }
    },
  },
  orderIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'orders',
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

/**
 * Check if email is taken
 * @param {string} email - The account's email
 * @param {string} [excludeaccountId] - The id of the account to be excluded
 * @returns {Promise<boolean>}
 */
accountSchema.statics.isEmailTaken = async function (
  email: string,
  excludeaccountId?: string
): Promise<boolean> {
  const account = await this.findOne({ email, _id: { $ne: excludeaccountId } });
  return !!account;
};

/**
 * Check if password matches the account's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
accountSchema.methods.isPasswordMatch = async function (
  password: string
): Promise<boolean> {
  const account = this;
  return bcrypt.compare(password, account.password);
};

accountSchema.pre('save', async function (next) {
  const account = this;
  if (account.isModified('password')) {
    account.password = await bcrypt.hash(account.password, 8);
  }
  next();
});

accountSchema.statics.build = (attrs: AccountAttrs) => {
  return new Account(attrs);
};
export const Account = mongoose.model<AccountDoc, AccountModel>(
  'accounts',
  accountSchema
);
