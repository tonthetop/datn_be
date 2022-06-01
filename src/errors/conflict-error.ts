import { CustomError } from './custom-error';

export class ConflictErorr extends CustomError {
  statusCode = 409;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, ConflictErorr.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
