import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorTypes } from '../exceptions/error-types';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    response.status(status).json({
      statusCode: status,
      message: Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message
        : [exceptionResponse.message],
      error: ErrorTypes.VALIDATION_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}