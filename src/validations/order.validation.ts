import Joi from 'joi';
import { objectId } from './custom.validation';
const createOrder = {
  body: Joi.object().keys({
    accountId: Joi.string().custom(objectId),
    orderType: Joi.string().required().valid('COD', 'PAYONL'), // COD - PayOnline
    deliveryAddress: Joi.string().required(),
    deliveryTime: Joi.date().required(),
    receivePhone: Joi.string().required(),
    description: Joi.string().allow('', null).max(500),
    status: Joi.string().required().valid('ACCEPTED', 'SUCCESS', 'CANCEL'), // ACCEPTED - SUCCESS - CANCEL
    productList: Joi.array()
      .items({
        productId: Joi.string().required().custom(objectId),
        discountId: Joi.string().custom(objectId),
        size: Joi.string().required(),
        amount: Joi.number().positive().required(),
      })
      .required()
      .min(1),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};
const getOrderByEmailOrPhone = {
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      phone: Joi.string(),
    })
    .min(1),
};

const updateOrder = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      deliveryAddress: Joi.string(),
      deliveryTime: Joi.date(),
      receivePhone: Joi.string(),
      description: Joi.string().allow('', null).max(500),
      status: Joi.string().valid('ACCEPTED', 'SUCCESS', 'CANCEL')
    })
    .min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

export {
  createOrder,
  getOrder,
  getOrderByEmailOrPhone,
  updateOrder,
  deleteOrder,
};
