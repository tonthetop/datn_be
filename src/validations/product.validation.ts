import Joi from 'joi';
import { objectId } from './custom.validation';
const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().trim().required().max(100),
    brand: Joi.string()
      .trim()
      .required()
      .max(10)
      .valid('ADIDAS', 'NIKE', 'JORDAN'),
    productType: Joi.string()
      .trim()
      .required()
      .max(15)
      .valid('GIAY', 'DEP', 'PHUKIEN'),
    price: Joi.number().positive().required(),
    imgList: Joi.array().items(Joi.string()),
    description: Joi.string().allow('', null).max(500),
    discountIds: Joi.array().items(Joi.string().custom(objectId)),
    productBySize: Joi.array().items(
      Joi.object({
        size: Joi.string().required(),
        amount: Joi.number().positive().required(),
      })
    ),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().trim().required().max(100),
      brand: Joi.string()
        .trim()
        .required()
        .max(10)
        .valid('ADIDAS', 'NIKE', 'JORDAN'),
      productType: Joi.string()
        .trim()
        .required()
        .max(15)
        .valid('GIAY', 'DEP', 'PHUKIEN'),
      price: Joi.number().positive().required(),
      imgList: Joi.array().items(Joi.string()),
      description: Joi.string().allow('', null).max(500),
      discountIds: Joi.array().items(Joi.string().custom(objectId)),
      productBySize: Joi.array().items(
        Joi.object({
          size: Joi.string().required(),
          amount: Joi.number().positive().required(),
        })
      ),
    })
    .min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

export { createProduct, getProduct, updateProduct, deleteProduct };
