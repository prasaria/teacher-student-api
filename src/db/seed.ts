// src/db/seed.ts
import { db } from './index';
import { teachers, students, teacherStudents } from './schema';

async function seed() {
  console.log('Seeding database...');

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await db.delete(teacherStudents);
    await db.delete(teachers);
    await db.delete(students);

    // Insert teachers
    console.log('Inserting teachers...');
    const [teacherKen, teacherJoe] = await db
      .insert(teachers)
      .values([
        { email: 'teacherken@gmail.com' },
        { email: 'teacherjoe@gmail.com' },
      ])
      .$returningId();

    // Insert students
    console.log('Inserting students...');
    const [student1, student2, student3, student4, student5] = await db
      .insert(students)
      .values([
        { email: 'commonstudent1@gmail.com' },
        { email: 'commonstudent2@gmail.com' },
        { email: 'student_only_under_teacher_ken@gmail.com' },
        { email: 'studentbob@gmail.com' },
        { email: 'studentmary@gmail.com' },
      ])
      .$returningId();

    // Create relationships
    console.log('Creating teacher-student relationships...');
    await db.insert(teacherStudents).values([
      // Ken's students
      { teacherId: teacherKen.id, studentId: student1.id },
      { teacherId: teacherKen.id, studentId: student2.id },
      { teacherId: teacherKen.id, studentId: student3.id },
      { teacherId: teacherKen.id, studentId: student4.id },

      // Joe's students
      { teacherId: teacherJoe.id, studentId: student1.id },
      { teacherId: teacherJoe.id, studentId: student2.id },
    ]);

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
  process.exit(0);
}

seed();
