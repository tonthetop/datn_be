import * as ErrorCollection from '../errors'
const catchAsync = (fn: (arg0: any, arg1: any, arg2: (arg0: any) => any) => any) => async (req: any, res: any, next: (arg0: any) => any) => {
   try {
        return await Promise.resolve(fn(req, res, next));
    } catch (err:any) {
        return next(new ErrorCollection.BadRequestError(err.message));
    }
};

export  {catchAsync};