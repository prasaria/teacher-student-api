// src/db/schema/relations.ts
import { mysqlTable, int, timestamp, primaryKey } from 'drizzle-orm/mysql-core';
import { teachers } from './teacher';
import { students } from './student';
import { relations } from 'drizzle-orm';

// Many-to-many relationship table between teachers and students
export const teacherStudents = mysqlTable(
  'teacher_students',
  {
    teacherId: int('teacher_id')
      .notNull()
      .references(() => teachers.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    studentId: int('student_id')
      .notNull()
      .references(() => students.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.teacherId, table.studentId] }),
    };
  }
);

// Define schema relations for easier querying
export const teachersRelations = relations(teachers, ({ many }) => ({
  students: many(teacherStudents),
}));

export const studentsRelations = relations(students, ({ many }) => ({
  teachers: many(teacherStudents),
}));

export const teacherStudentsRelations = relations(
  teacherStudents,
  ({ one }) => ({
    teacher: one(teachers, {
      fields: [teacherStudents.teacherId],
      references: [teachers.id],
    }),
    student: one(students, {
      fields: [teacherStudents.studentId],
      references: [students.id],
    }),
  })
);
