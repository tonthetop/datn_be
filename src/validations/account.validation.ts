import Joi from 'joi';
import { password, objectId } from './custom.validation';

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),   
    birth: Joi.date().required(),
    role: Joi.string().required().valid('USER', 'ADMIN'),
  }),
};

const getUser = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
    password: Joi.string().custom(password),
    name: Joi.string(),
    address: Joi.string(),
    phone: Joi.string(),
    birth: Joi.string(),
    orderIds: Joi.array().items(Joi.object()),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

export { createUser, getUser, updateUser, deleteUser };
