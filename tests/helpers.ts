// tests/helpers.ts
import { teachers, students, teacherStudents } from '../src/db/schema';
import { resetTestDb } from './setup';
import { getTestDb } from '../src/db/test-db';
import request from 'supertest';
import app from '../src/app';

// Reset database before each test
export const resetDatabase = async () => {
  await resetTestDb();
};

// Create test data
export const createTestData = async () => {
  try {
    const db = await getTestDb();
    
    // Insert test teachers
    const [teacherKen] = await db
      .insert(teachers)
      .values({ email: 'teacherken@gmail.com' });
    
    const [teacherJoe] = await db
      .insert(teachers)
      .values({ email: 'teacherjoe@gmail.com' });
    
    // Insert test students
    const [student1] = await db
      .insert(students)
      .values({ email: 'commonstudent1@gmail.com' });
    
    const [student2] = await db
      .insert(students)
      .values({ email: 'commonstudent2@gmail.com' });
    
    const [student3] = await db
      .insert(students)
      .values({ email: 'student_only_under_teacher_ken@gmail.com' });
    
    const [student4] = await db
      .insert(students)
      .values({ email: 'studentbob@gmail.com' });
    
    const [student5] = await db
      .insert(students)
      .values({ email: 'studentmary@gmail.com' });
    
    // Create relationships
    await db.insert(teacherStudents).values([
      // Ken's students
      { teacherId: teacherKen.insertId, studentId: student1.insertId },
      { teacherId: teacherKen.insertId, studentId: student2.insertId },
      { teacherId: teacherKen.insertId, studentId: student3.insertId },
      { teacherId: teacherKen.insertId, studentId: student4.insertId },
      
      // Joe's students
      { teacherId: teacherJoe.insertId, studentId: student1.insertId },
      { teacherId: teacherJoe.insertId, studentId: student2.insertId },
    ]);
    
    return {
      teachers: { ken: teacherKen, joe: teacherJoe },
      students: { student1, student2, student3, student4, student5 }
    };
  } catch (error) {
    console.error('Error creating test data:', error);
    throw error;
  }
};

// Test API client
export const apiClient = {
  registerStudents: (teacherEmail: string, studentEmails: string[]) => {
    return request(app)
      .post('/api/register')
      .send({
        teacher: teacherEmail,
        students: studentEmails
      });
  },
  
  getCommonStudents: (teacherEmails: string | string[]) => {
    let url = '/api/commonstudents';
    
    if (Array.isArray(teacherEmails)) {
      const queryParams = teacherEmails.map(email => `teacher=${encodeURIComponent(email)}`).join('&');
      url += `?${queryParams}`;
    } else {
      url += `?teacher=${encodeURIComponent(teacherEmails)}`;
    }
    
    return request(app).get(url);
  },
  
  suspendStudent: (studentEmail: string) => {
    return request(app)
      .post('/api/suspend')
      .send({
        student: studentEmail
      });
  },
  
  retrieveForNotifications: (teacherEmail: string, notification: string) => {
    return request(app)
      .post('/api/retrievefornotifications')
      .send({
        teacher: teacherEmail,
        notification
      });
  }
};