import { PrismaClientErrorCode } from '@app/lib/prisma/enums';
import type { ArgumentsHost } from '@nestjs/common';
import { Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

// see: https://www.prisma.io/blog/nestjs-prisma-error-handling-7D056s1kOop2
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  public catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code as PrismaClientErrorCode) {
      case PrismaClientErrorCode.UniqueConstraintFailed: {
        const entity: string = (exception?.meta as { target: string[] })?.target[0];

        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: `${entity} já existe`,
        });
        break;
      }
      case PrismaClientErrorCode.RecordNotFound: {
        response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: exception.message,
        });
        break;
      }
      default:
        // default 500 error code
        super.catch(exception, host);
        break;
    }
  }
}
