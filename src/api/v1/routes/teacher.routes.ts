// src/api/v1/routes/teacher.routes.ts
import { Router } from 'express';
import {
  registerStudents,
  getCommonStudents,
  suspendStudent,
  retrieveForNotifications,
} from '../controllers/teacher.controller';
import { validate } from '../../../middlewares/validation.middleware';
import {
  registerStudentsSchema,
  commonStudentsSchema,
  suspendStudentSchema,
  retrieveForNotificationsSchema,
} from '../validations/teacher.validation';

const router = Router();

// 1. Register students to a teacher
router.post('/register', validate(registerStudentsSchema), registerStudents);

// 2. Get common students for teachers
router.get(
  '/commonstudents',
  validate(commonStudentsSchema),
  getCommonStudents
);

// 3. Suspend a student
router.post('/suspend', validate(suspendStudentSchema), suspendStudent);

// 4. Retrieve students for notifications
router.post(
  '/retrievefornotifications',
  validate(retrieveForNotificationsSchema),
  retrieveForNotifications
);

export default router;
