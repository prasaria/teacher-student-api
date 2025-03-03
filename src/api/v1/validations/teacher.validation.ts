// src/api/v1/validations/teacher.validation.ts
import { z } from 'zod';
import { emailValidator, createValidationSchema } from './common.validation';

// Register students schema
export const registerStudentsSchema = createValidationSchema(
  z.object({
    teacher: emailValidator,
    students: z
      .array(emailValidator)
      .min(1, 'At least one student must be provided'),
  })
);

// Common students query schema
export const commonStudentsSchema = createValidationSchema(
  z.object({}).optional(),
  z.object({
    teacher: z.union([emailValidator, z.array(emailValidator)]),
  })
);

// Suspend student schema
export const suspendStudentSchema = createValidationSchema(
  z.object({
    student: emailValidator,
  })
);

// Retrieve for notifications schema
export const retrieveForNotificationsSchema = createValidationSchema(
  z.object({
    teacher: emailValidator,
    notification: z.string().min(1, 'Notification cannot be empty'),
  })
);
