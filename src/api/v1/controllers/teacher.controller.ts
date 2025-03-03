// src/api/v1/controllers/teacher.controller.ts
import { Request, Response } from 'express';
import { teacherService } from '../../../services/teacher.service';
import asyncHandler from 'express-async-handler';
import { BadRequestError, NotFoundError } from '../../../utils/error';
import {
  registerStudentsSchema,
  commonStudentsSchema,
  suspendStudentSchema,
  retrieveForNotificationsSchema,
} from '../validations/teacher.validation';

// 1. Register students endpoint
export const registerStudents = asyncHandler(
  async (req: Request, res: Response) => {
    const { success, error, data } = registerStudentsSchema.safeParse(req.body);

    if (!success) {
      throw new BadRequestError(error.message);
    }

    await teacherService.registerStudents(data.teacher, data.students);

    res.status(204).send();
  }
);

// 2. Get common students endpoint
export const getCommonStudents = asyncHandler(
  async (req: Request, res: Response) => {
    const teacherParam = req.query.teacher;

    if (!teacherParam) {
      throw new BadRequestError('Teacher parameter is required');
    }

    // Handle both single and multiple teacher parameters
    const teacherEmails = Array.isArray(teacherParam)
      ? teacherParam.map((t) => t.toString())
      : [teacherParam.toString()];

    const commonStudents =
      await teacherService.getCommonStudents(teacherEmails);

    res.status(200).json({ students: commonStudents });
  }
);

// 3. Suspend student endpoint
export const suspendStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const { success, error, data } = suspendStudentSchema.safeParse(req.body);

    if (!success) {
      throw new BadRequestError(error.message);
    }

    try {
      await teacherService.suspendStudent(data.student);
      res.status(204).send();
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new BadRequestError(err.message);
      }
      throw err;
    }
  }
);

// 4. Retrieve notification recipients endpoint
export const retrieveForNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const { success, error, data } = retrieveForNotificationsSchema.safeParse(
      req.body
    );

    if (!success) {
      throw new BadRequestError(error.message);
    }

    try {
      const recipients = await teacherService.getNotificationRecipients(
        data.teacher,
        data.notification
      );

      res.status(200).json({ recipients });
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new BadRequestError(err.message);
      }
      throw err;
    }
  }
);
