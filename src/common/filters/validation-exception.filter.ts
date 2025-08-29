import { BadRequestException, ValidationError, ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

// Helper function to convert camelCase to snake_case
function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export const validationExceptionFactory = (validationErrors: ValidationError[] = []) => {
  console.log("validationErrors", JSON.stringify(validationErrors, null, 2));

  // Group errors by field and only take the first error for each field
  const fieldErrors = new Map<string, any>();

  validationErrors.forEach(err => {
    const fieldName = camelToSnakeCase(err.property);
    
    // Only process this field if we haven't seen an error for it yet
    if (!fieldErrors.has(fieldName)) {
      if (err.constraints) {
        // Get the first constraint error for this field
        const firstConstraintKey = Object.keys(err.constraints)[0];
        const firstConstraintMsg = err.constraints[firstConstraintKey];
        const context = err.contexts?.[firstConstraintKey] || null;

        fieldErrors.set(fieldName, {
          field: fieldName,
          error_code: context?.error_code || 'VALIDATION_ERROR',
          message: context?.message || firstConstraintMsg,
          details: context?.details || firstConstraintMsg,
        });
      }
    }
  });

  // Convert Map to array
  const errors = Array.from(fieldErrors.values());

  return new BadRequestException({
    code: 400,
    message: 'Invalid input data',
    errors,
  });
};

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const res: any = exception.getResponse();
    
    // Check if this is a validation error with our custom format
    if (res.errors && Array.isArray(res.errors)) {
      // This is our custom validation error, return it as is
      response.status(HttpStatus.BAD_REQUEST).json({
        code: res.code || HttpStatus.BAD_REQUEST,
        message: res.message || 'Invalid input data',
        errors: res.errors,
      });
    } else {
      // Let it pass to the next filter
      throw exception;
    }
  }
}
