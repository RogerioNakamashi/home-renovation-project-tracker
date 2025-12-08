import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ZodSchema, ZodIssue } from 'zod';
import { BadRequestException } from '@nestjs/common';

export const ValidateInput = (schema: ZodSchema) => {
  return createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(ctx);
    const args = gqlContext.getArgs();
    const input = args.input || args;

    const result = schema.safeParse(input);

    if (!result.success) {
      const errors = result.error.issues.map((issue: ZodIssue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      throw new BadRequestException({
        message: 'Validation failed',
        errors,
      });
    }

    return result.data;
  })();
};
