// src/services/student.service.ts
import { db } from '../db';
import { students } from '../db/schema';
import { eq } from 'drizzle-orm';

export const studentService = {
  async findByEmail(email: string) {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.email, email));

    return student;
  },
};
