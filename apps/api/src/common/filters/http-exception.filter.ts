import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

export interface ApiErrorResponse {
  code: number;
  data: null;
  msg: string;
  error: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;
    let errorName: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : (((res as Record<string, unknown>).message as string) ??
            exception.message);
      if (Array.isArray(message)) message = message.join('; ');
      errorName = exception.constructor.name;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
      errorName = 'InternalServerError';
    }

    this.logger.error(
      `[${errorName}] ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json({
      code: status,
      data: null,
      msg: message,
      error: errorName,
    } satisfies ApiErrorResponse);
  }
}
