import mongoose, { ObjectId } from 'mongoose';
import { OrderDoc } from './order.model';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongooseDelete from 'mongoose-delete';
import { boolean } from 'joi';

interface token {
  token: string;
}
export interface AccountAttrs {
  email: string;
  name: string;
  address: string;
  phone: string;
  birth: Date;
  role: string;
  password: string;
  emailToken:string;
  isVerified:boolean;
  orderIds: OrderDoc[];
  tokens: token[];
}

export interface AccountDoc extends mongoose.Document {
  generateAuthToken(): Promise<string>;
  isPasswordMatch(password: string): Promise<boolean>;
  email: string;
  name: string;
  address: string;
  phone: string;
  birth: Date;
  role: string;
  password: string;
  emailToken:string;
  isVerified:boolean;
  orderIds: OrderDoc[];
  tokens: token[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountModel extends mongoose.Model<AccountDoc> {
  isEmailAndPhoneTaken(email: string, phone: string): Promise<boolean>;
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
  emailToken: {
    type: String,
    require: true,
  },
  isVerified: {
    type: Boolean,
    require: true,
  },
  orderIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'orders',
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

/**
 * Check if email is taken
 * @returns {Promise<string>}
 */
accountSchema.methods.generateAuthToken = async function (): Promise<string> {
  // Generate an auth token for the account
  const account = this;
  const token = jwt.sign(
    { _id: account._id, email: account.email, role: account.role },
    process.env.JWT_SECRET as any
  );
  account.tokens = account.tokens.concat({ token });
  await account.save();
  return token;
};

/**
 * Check if email is taken
 * @param {string} email - The account's email
 * @param {string} [phone] - The phone
 * @returns {Promise<boolean>}
 */
accountSchema.statics.isEmailAndPhoneTaken = async function (
  email: string,
  phone: string
): Promise<boolean> {
  const account = await this.findOne({
    $or: [{ email: email }, { phone: phone }],
  });
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
//Add plugin
accountSchema.plugin(mongooseDelete, {
  deleteAt: true,
  overrideMethods: 'all',
});

export const Account = mongoose.model<AccountDoc, AccountModel>(
  'accounts',
  accountSchema
);
