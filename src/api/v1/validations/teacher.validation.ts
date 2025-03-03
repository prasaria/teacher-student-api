// src/api/v1/validations/teacher.validation.ts
import { z } from 'zod';

// Email regex pattern
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const registerStudentsSchema = z.object({
  teacher: z.string().regex(emailPattern, 'Invalid teacher email format'),
  students: z
    .array(z.string().regex(emailPattern, 'Invalid student email format'))
    .min(1, 'At least one student must be provided'),
});

export const commonStudentsSchema = z.object({
  teacher: z.union([
    z.string().regex(emailPattern, 'Invalid teacher email format'),
    z.array(z.string().regex(emailPattern, 'Invalid teacher email format')),
  ]),
});

export const suspendStudentSchema = z.object({
  student: z.string().regex(emailPattern, 'Invalid student email format'),
});

export const retrieveForNotificationsSchema = z.object({
  teacher: z.string().regex(emailPattern, 'Invalid teacher email format'),
  notification: z.string().min(1, 'Notification cannot be empty'),
});
