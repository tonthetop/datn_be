import Joi from 'joi';
import {pick} from '../utils';
import { Request,Response,NextFunction } from 'express';
import * as ErrorCollections from "../errors"

const validate = (schema:any) => (req:Request, res:Response, next:NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ErrorCollections.BadRequestError(errorMessage));
  }
  Object.assign(req, value);
  return next();
};
export {validate};
