import * as ErrorCollection from '../errors';

const deliveryError = (err: any) => {
  switch (err.statusCode) {
    case 400:
      return new ErrorCollection.BadRequestError(err.message);
    case 401:
      return new ErrorCollection.NotAuthorizedError();
    case 402:
      return new ErrorCollection.PaymentError();
    case 403:
      return new ErrorCollection.ForbiddenError();
    case 404:
      return new ErrorCollection.NotFoundError();
    case 409:
      return new ErrorCollection.ConflictErorr(err.message);
    case 500:
      return new ErrorCollection.ServerError(err.message);
    default:
      return new ErrorCollection.ServerError(err.message);
  }
};
const catchAsync =
  (fn: (arg0: any, arg1: any, arg2: (arg0: any) => any) => any) =>
  async (req: any, res: any, next: (arg0: any) => any) => {
    try {
      return await Promise.resolve(fn(req, res, next));
    } catch (err: any) {
      console.log('Error in catchAsync: ', err.message);
      return next(deliveryError(err));
    }
  };
export { catchAsync };
