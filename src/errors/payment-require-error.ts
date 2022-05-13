import { CustomError } from './custom-error';

export class PaymentError extends CustomError {
  statusCode = 402;

  constructor() {
    super('Payment Required',);

    Object.setPrototypeOf(this, PaymentError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Payment Required' }];
  }
}
