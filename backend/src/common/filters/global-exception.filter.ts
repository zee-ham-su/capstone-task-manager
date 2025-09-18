import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { ErrorResponse, ErrorTypes } from '../exceptions/error-types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let errorResponse: ErrorResponse;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      errorResponse = {
        statusCode: status,
        message: exceptionResponse.message || exception.message,
        error: exceptionResponse.error || exception.name,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    } else if (exception instanceof MongoError) {
      // Handle MongoDB specific errors
      switch (exception.code) {
        case 11000:
          errorResponse = {
            statusCode: HttpStatus.CONFLICT,
            message: 'Duplicate entry found',
            error: ErrorTypes.DUPLICATE_ENTRY,
            timestamp: new Date().toISOString(),
            path: request.url,
          };
          break;
        default:
          errorResponse = {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Database error occurred',
            error: ErrorTypes.INTERNAL_SERVER_ERROR,
            timestamp: new Date().toISOString(),
            path: request.url,
          };
      }
    } else {
      // Handle any other errors
      errorResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: ErrorTypes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    // Log the error for debugging (you can implement proper logging here)
    console.error('Error:', {
      exception,
      errorResponse,
    });

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}