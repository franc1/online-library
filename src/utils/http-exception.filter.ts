import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

import { ApiError } from './api-error';
import { ErrorCodes } from './error-codes';
import { ErrorResponse } from './error.response';

export enum ExceptionEnum {
  NOT_FOUND = 'Not Found',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  BAD_REQUEST = 'Bad Request',
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse: any = exception.getResponse();

    let message = exception.message ?? null;
    let data: any;

    if (exception instanceof ApiError) {
      data = (exceptionResponse as any)?.data ?? null;
    } else if (exception instanceof NotFoundException) {
      message = ErrorCodes.NOT_FOUND;
      data = exceptionResponse.error
        ? exceptionResponse.message
        : exceptionResponse.message !== ExceptionEnum.NOT_FOUND
        ? exceptionResponse
        : null;
    } else if (exception instanceof UnauthorizedException) {
      message = ErrorCodes.UNAUTHORIZED;
      data = exceptionResponse.error
        ? exceptionResponse.message
        : exceptionResponse.message !== ExceptionEnum.UNAUTHORIZED
        ? exceptionResponse
        : null;
    } else if (exception instanceof ForbiddenException) {
      message = ErrorCodes.FORBIDDEN;
      data = exceptionResponse.error
        ? exceptionResponse.message
        : exceptionResponse.message !== ExceptionEnum.FORBIDDEN
        ? exceptionResponse
        : null;
    } else if (exception instanceof BadRequestException) {
      message = ErrorCodes.BAD_REQUEST;
      data = exceptionResponse.error
        ? exceptionResponse.message
        : exceptionResponse.message !== ExceptionEnum.BAD_REQUEST
        ? exceptionResponse
        : null;
    } else {
      data = exceptionResponse;
    }

    response.status(status).json({ ...new ErrorResponse(message, data) });
  }
}
