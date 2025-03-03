// src/api/v1/routes/teacher.routes.ts
import { Router } from 'express';
import {
  registerStudents,
  getCommonStudents,
  suspendStudent,
  retrieveForNotifications,
} from '../controllers/teacher.controller';

const router = Router();

// 1. Register students to a teacher
router.post('/register', registerStudents);

// 2. Get common students for teachers
router.get('/commonstudents', getCommonStudents);

// 3. Suspend a student
router.post('/suspend', suspendStudent);

// 4. Retrieve students for notifications
router.post('/retrievefornotifications', retrieveForNotifications);

export default router;
