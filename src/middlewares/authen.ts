import jwt from 'jsonwebtoken';
import express, { Request, Response, NextFunction } from 'express';
import { Account } from '../models';
import * as ErrorCollection from '../errors';
import { string } from 'joi';
/**
 * Authentication Token(in System)
 * Param in request.body
 * @param {object} req request from client to server
 * @param {object} res response from server to client
 * @param {function} next action to next request
 */
async function authenticationToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('vao authen');
  try {
    const authHeader = req.headers['authorization'];
    const token = (authHeader && authHeader.split(' ')[1]) || '';
    if (!token) {
      res.statusMessage = 'You dont have token!';
      res.status(401).send();
    }
    jwt.verify(
      token,
      (process.env.JWT_SECRET as any),
      async (err:any, payload:any) => {
        //error verify
        if (err) {
          res.statusMessage = err.message || 'Token is not valid';
          console.log('payload', payload);
          res.status(401).send();
        } else {
          //success verify
          try {
            const account = await Account.findOne({
              _id: (payload as any)._id,
              'tokens.token': token,
            });
            if (!account) {
              throw new Error('Token is not expried anymore');
            }
            (req as any).payload = { account, token };
            next();
          } catch (error: any) {
            next(new ErrorCollection.BadRequestError(error.message));
          }
        }
      }
    );
  } catch (err) {
    console.log('Something error in AuthenMiddleWare', err);
    res.statusMessage = 'Something error in AuthenMiddleWare';
    res.status(500).send();
  }
}
export { authenticationToken };
