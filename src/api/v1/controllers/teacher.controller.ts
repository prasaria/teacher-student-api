// src/api/v1/controllers/teacher.controller.ts
import { Request, Response } from 'express';
import { teacherService } from '../../../services/teacher.service';
import asyncHandler from 'express-async-handler';
import { BadRequestError, NotFoundError } from '../../../utils/error';

// 1. Register students endpoint
export const registerStudents = asyncHandler(
  async (req: Request, res: Response) => {
    const { teacher, students } = req.body;

    await teacherService.registerStudents(teacher, students);

    res.status(204).send();
  }
);

// 2. Get common students endpoint
export const getCommonStudents = asyncHandler(
  async (req: Request, res: Response) => {
    // We know teacherParam is defined,
    // but we still need to handle TypeScript's type checking
    const teacherParam = req.query.teacher;

    if (!teacherParam) {
      // This check is actually redundant due to validation middleware,
      // but it helps TypeScript understand the value is defined
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
    const { student } = req.body;

    try {
      await teacherService.suspendStudent(student);
      res.status(204).send();
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw err; // Let the error middleware handle it
      }
      throw err;
    }
  }
);

// 4. Retrieve notification recipients endpoint
export const retrieveForNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const { teacher, notification } = req.body;

    try {
      const recipients = await teacherService.getNotificationRecipients(
        teacher,
        notification
      );

      res.status(200).json({ recipients });
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw err; // Let the error middleware handle it
      }
      throw err;
    }
  }
);
