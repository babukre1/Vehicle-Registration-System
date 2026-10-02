import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'We could not complete your request. Please try again. If the problem continues, contact support.';
    let details: unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') message = body;
      else if (body && typeof body === 'object') {
        const value = body as { message?: string | string[]; details?: unknown };
        message = Array.isArray(value.message) ? value.message.join(' ') : value.message ?? message;
        details = value.details;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        const fields = Array.isArray(exception.meta?.target) ? (exception.meta.target as string[]) : [];
        const labels: Record<string, string> = {
          email: 'email address', plateNumber: 'plate number', chassisNumber: 'chassis number',
          engineNumber: 'engine number', nationalId: 'national ID', objectKey: 'document',
        };
        const names = fields.map((field) => labels[field] ?? field).join(', ');
        message = names ? `A record with this ${names} already exists.` : 'This record already exists.';
      } else if (exception.code === 'P2003') {
        status = HttpStatus.BAD_REQUEST;
        message = 'A related account or record could not be found. Please sign in again and retry.';
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'The requested record could not be found.';
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Some required information is missing or invalid. Please review the form and try again.';
    }

    if (status >= 500) this.logger.error(exception);
    response.status(status).json({ statusCode: status, error: HttpStatus[status] ?? 'Error', message, ...(details ? { details } : {}) });
  }
}
