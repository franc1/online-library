import { HttpException } from '@nestjs/common';

import { ErrorCodes } from './error-codes';

export class ApiError extends HttpException {
  constructor(
    public httpCode: number,
    public message: ErrorCodes,
    public data: any = null,
  ) {
    super({ message, data }, httpCode);
  }
}
