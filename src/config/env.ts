// src/config/env.ts
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Define validation schema for environment variables
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3000),

  // Database configuration
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(3306),
  DB_NAME: z.string().default('teacher_student'),
  DB_USER: z.string().default('root'),
  DB_PASSWORD: z.string().default('password'),

  // Log level
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Parse and validate environment variables
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
