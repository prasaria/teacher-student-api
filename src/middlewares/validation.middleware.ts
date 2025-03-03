// src/middlewares/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { BadRequestError } from '../utils/error';

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request against schema
      const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (!result.success) {
        // Format Zod errors into a readable format
        const errorMessage = formatZodError(result.error);
        throw new BadRequestError(errorMessage);
      }

      // Optionally, replace request properties with validated data
      req.body = result.data.body;
      req.query = result.data.query;
      req.params = result.data.params;

      return next();
    } catch (error) {
      next(error);
    }
  };
};

// Helper function to format Zod errors
function formatZodError(error: ZodError): string {
  return error.errors
    .map((e) => {
      const field = e.path.join('.');
      return `${field}: ${e.message}`;
    })
    .join(', ');
}
