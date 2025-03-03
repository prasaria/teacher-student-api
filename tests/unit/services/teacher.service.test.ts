// tests/unit/services/teacher.service.test.ts
import { teacherService } from '../../../src/services/teacher.service';
import { resetDatabase, createTestData } from '../../helpers';
import { getTestDb } from '../../../src/db/test-db';
import { teachers, students, teacherStudents } from '../../../src/db/schema';
import { eq } from 'drizzle-orm';

describe('Teacher Service', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  describe('registerStudents', () => {
    it('should register students to a teacher', async () => {
      const db = await getTestDb();
      
      // Register students
      await teacherService.registerStudents(
        'teacher1@example.com',
        ['student1@example.com', 'student2@example.com']
      );
      
      // Verify teacher was created
      const [teacher] = await db
        .select()
        .from(teachers)
        .where(eq(teachers.email, 'teacher1@example.com'));
      
      expect(teacher).toBeDefined();
      expect(teacher.email).toBe('teacher1@example.com');
      
      // Verify students were created
      const allStudents = await db
        .select()
        .from(students)
        .where(eq(students.email, 'student1@example.com') || eq(students.email, 'student2@example.com'));
      
      expect(allStudents.length).toBe(2);
      
      // Verify relationships were created
      const relations = await db
        .select()
        .from(teacherStudents)
        .where(eq(teacherStudents.teacherId, teacher.id));
      
      expect(relations.length).toBe(2);
    });
  });
  
  describe('getCommonStudents', () => {
    it('should get students for a single teacher', async () => {
      await createTestData();
      
      const commonStudents = await teacherService.getCommonStudents(['teacherken@gmail.com']);
      
      expect(commonStudents).toContain('commonstudent1@gmail.com');
      expect(commonStudents).toContain('commonstudent2@gmail.com');
      expect(commonStudents).toContain('student_only_under_teacher_ken@gmail.com');
      expect(commonStudents).toContain('studentbob@gmail.com');
      expect(commonStudents.length).toBe(4);
    });
    
    it('should get common students for multiple teachers', async () => {
      await createTestData();
      
      const commonStudents = await teacherService.getCommonStudents([
        'teacherken@gmail.com',
        'teacherjoe@gmail.com'
      ]);
      
      expect(commonStudents).toContain('commonstudent1@gmail.com');
      expect(commonStudents).toContain('commonstudent2@gmail.com');
      expect(commonStudents.length).toBe(2);
    });
  });
  
  describe('suspendStudent', () => {
    it('should suspend a student', async () => {
      const db = await getTestDb();
      await createTestData();
      
      await teacherService.suspendStudent('commonstudent1@gmail.com');
      
      const [student] = await db
        .select()
        .from(students)
        .where(eq(students.email, 'commonstudent1@gmail.com'));
      
      expect(student.suspended).toBe(true);
    });
  });
  
  describe('getNotificationRecipients', () => {
    it('should get students who can receive notifications', async () => {
      await createTestData();
      
      const recipients = await teacherService.getNotificationRecipients(
        'teacherken@gmail.com',
        'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com'
      );
      
      // Registered students + mentioned students
      expect(recipients).toContain('commonstudent1@gmail.com');
      expect(recipients).toContain('commonstudent2@gmail.com');
      expect(recipients).toContain('student_only_under_teacher_ken@gmail.com');
      expect(recipients).toContain('studentbob@gmail.com');
      expect(recipients).toContain('studentagnes@gmail.com');
      expect(recipients).toContain('studentmiche@gmail.com');
    });
    
    it('should not include suspended students', async () => {
      const db = await getTestDb();
      await createTestData();
      
      // Suspend a student
      await db
        .update(students)
        .set({ suspended: true })
        .where(eq(students.email, 'commonstudent1@gmail.com'));
      
      const recipients = await teacherService.getNotificationRecipients(
        'teacherken@gmail.com',
        'Hello students!'
      );
      
      expect(recipients).not.toContain('commonstudent1@gmail.com');
      expect(recipients).toContain('commonstudent2@gmail.com');
    });
  });
});