// src/config/test.env.ts
import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

// Define validation schema for test environment variables
const testEnvSchema = z.object({
  NODE_ENV: z.enum(['test']).default('test'),
  PORT: z.coerce.number().default(3001),

  // Test database configuration
  TEST_DB_HOST: z.string().default('localhost'),
  TEST_DB_PORT: z.coerce.number().default(3306),
  TEST_DB_NAME: z.string().default('teacher_student_test'),
  TEST_DB_USER: z.string().default('root'),
  TEST_DB_PASSWORD: z.string().default('password'),
});

// Parse and validate test environment variables
const _testEnv = testEnvSchema.safeParse(process.env);

if (!_testEnv.success) {
  console.error(
    '❌ Invalid test environment variables:',
    _testEnv.error.format()
  );
  throw new Error('Invalid test environment variables');
}

export const testEnv = _testEnv.data;
