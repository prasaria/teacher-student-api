// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/error';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  console.error(`Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  // Default status code and message
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle specific error types
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = err.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join(', ');
  } else if (err.name === 'SyntaxError') {
    statusCode = 400;
    message = 'Invalid JSON';
  }

  // Send error response
  res.status(statusCode).json({
    message,
    ...(env.NODE_ENV === 'development' && {
      stack: err.stack,
      name: err.name,
    }),
  });
};

// Request logger middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
    );
  });

  next();
};
