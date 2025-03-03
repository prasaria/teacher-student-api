// src/services/teacher.service.ts
import { db } from '../db';
import { teachers, students, teacherStudents } from '../db/schema';
import { eq, and, inArray, sql } from 'drizzle-orm';
import { NotFoundError } from '../utils/error';

export const teacherService = {
  /**
   * Register one or more students to a teacher
   */
  async registerStudents(
    teacherEmail: string,
    studentEmails: string[]
  ): Promise<void> {
    // Find or create teacher
    let [teacher] = await db
      .select()
      .from(teachers)
      .where(eq(teachers.email, teacherEmail));

    if (!teacher) {
      // Insert and get the ID
      const [{ id: teacherId }] = await db
        .insert(teachers)
        .values({ email: teacherEmail })
        .$returningId();

      // Fetch the full record
      [teacher] = await db
        .select()
        .from(teachers)
        .where(eq(teachers.id, teacherId));
    }

    // Find or create students and build relationships
    for (const studentEmail of studentEmails) {
      let [student] = await db
        .select()
        .from(students)
        .where(eq(students.email, studentEmail));

      if (!student) {
        // Insert and get the ID
        const [{ id: studentId }] = await db
          .insert(students)
          .values({ email: studentEmail })
          .$returningId();

        // Fetch the full record
        [student] = await db
          .select()
          .from(students)
          .where(eq(students.id, studentId));
      }

      // Check if relationship already exists
      const [existingRelation] = await db
        .select()
        .from(teacherStudents)
        .where(
          and(
            eq(teacherStudents.teacherId, teacher.id),
            eq(teacherStudents.studentId, student.id)
          )
        );

      // Create relationship if it doesn't exist
      if (!existingRelation) {
        await db.insert(teacherStudents).values({
          teacherId: teacher.id,
          studentId: student.id,
        });
      }
    }
  },

  /**
   * Get students common to a list of teachers
   */
  async getCommonStudents(teacherEmails: string[]): Promise<string[]> {
    // Find teachers by emails
    const teacherResults = await db
      .select()
      .from(teachers)
      .where(inArray(teachers.email, teacherEmails));

    if (teacherResults.length === 0) {
      return [];
    }

    const teacherIds = teacherResults.map((t) => t.id);

    // Query to find students common to all specified teachers
    const commonStudentsQuery = db
      .select({
        studentId: teacherStudents.studentId,
        count: sql<number>`count(${teacherStudents.teacherId})`.as('count'),
      })
      .from(teacherStudents)
      .where(inArray(teacherStudents.teacherId, teacherIds))
      .groupBy(teacherStudents.studentId)
      .having(sql`count(${teacherStudents.teacherId}) = ${teacherIds.length}`);

    const commonStudentIds = (await commonStudentsQuery).map(
      (item) => item.studentId
    );

    if (commonStudentIds.length === 0) {
      return [];
    }

    // Get student emails
    const studentEmails = await db
      .select()
      .from(students)
      .where(inArray(students.id, commonStudentIds));

    return studentEmails.map((s) => s.email);
  },

  /**
   * Suspend a student
   */
  async suspendStudent(studentEmail: string): Promise<void> {
    // Find student by email
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.email, studentEmail));

    if (!student) {
      throw new NotFoundError(`Student with email ${studentEmail} not found`);
    }

    // Mark student as suspended
    await db
      .update(students)
      .set({ suspended: true })
      .where(eq(students.id, student.id));
  },

  /**
   * Get students who can receive a notification
   */
  async getNotificationRecipients(
    teacherEmail: string,
    notification: string
  ): Promise<string[]> {
    // Find teacher by email
    const [teacher] = await db
      .select()
      .from(teachers)
      .where(eq(teachers.email, teacherEmail));

    if (!teacher) {
      throw new NotFoundError(`Teacher with email ${teacherEmail} not found`);
    }

    // Extract mentioned student emails from notification
    const mentionedEmails = extractEmails(notification);

    // Get students registered to the teacher who are not suspended
    const registeredStudents = await db
      .select({ email: students.email })
      .from(teacherStudents)
      .innerJoin(students, eq(teacherStudents.studentId, students.id))
      .where(
        and(
          eq(teacherStudents.teacherId, teacher.id),
          eq(students.suspended, false)
        )
      );

    const registeredEmails = registeredStudents.map((s) => s.email);

    // Get mentioned students who are not suspended
    const mentionedStudents = await db
      .select({ email: students.email })
      .from(students)
      .where(
        and(
          inArray(students.email, mentionedEmails),
          eq(students.suspended, false)
        )
      );

    const validMentionedEmails = mentionedStudents.map((s) => s.email);

    // Combine and remove duplicates
    return [...new Set([...registeredEmails, ...validMentionedEmails])];
  },
};

/**
 * Extract emails from notification text that follow @email format
 */
function extractEmails(notification: string): string[] {
  const regex = /@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const matches = notification.match(regex) || [];
  return matches.map((match) => match.substring(1)); // Remove the @ prefix
}
