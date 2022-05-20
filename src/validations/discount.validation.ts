import Joi from 'joi';
import { objectId } from './custom.validation';

const createDiscount = {
  body: Joi.object().keys({
    value:  Joi.number().positive().required(),
    timeBegin: Joi.date().required(),
    timeEnd: Joi.date().required(),
  }),
};

const getDiscount = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  })
};

const updateDiscount = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      value:  Joi.number().positive().required(),
      timeBegin: Joi.date().required(),
      timeEnd: Joi.date().required(),
    })
    .min(1)
};

const deleteDiscount = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

export { createDiscount, getDiscount, updateDiscount, deleteDiscount };
