// src/api/v1/validations/common.validation.ts
import { z } from 'zod';

// Common email pattern
export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Email validator
export const emailValidator = z
  .string()
  .regex(emailPattern, 'Invalid email format');

// Create schemas for request components
export const createValidationSchema = <
  T extends z.ZodTypeAny,
  U extends z.ZodTypeAny,
  V extends z.ZodTypeAny,
>(
  body?: T,
  query?: U,
  params?: V
) => {
  return z.object({
    body: body || z.any().optional(),
    query: query || z.any().optional(),
    params: params || z.any().optional(),
  });
};
