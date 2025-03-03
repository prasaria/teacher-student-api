// tests/integration/api/v1/commonstudents.test.ts
import { resetDatabase, createTestData } from '../../../helpers';
import { apiClient } from '../../../helpers';
import request from 'supertest'; // Add this import
import app from '../../../../src/app'; // Make sure to import your app

describe('GET /api/commonstudents', () => {
  beforeEach(async () => {
    await resetDatabase();
    await createTestData();
  });

  it('should get students for a single teacher', async () => {
    const response = await apiClient.getCommonStudents('teacherken@gmail.com');
    
    expect(response.status).toBe(200);
    expect(response.body.students).toContain('commonstudent1@gmail.com');
    expect(response.body.students).toContain('commonstudent2@gmail.com');
    expect(response.body.students).toContain('student_only_under_teacher_ken@gmail.com');
    expect(response.body.students).toContain('studentbob@gmail.com');
    expect(response.body.students.length).toBe(4);
  });
  
  it('should get common students for multiple teachers', async () => {
    const response = await apiClient.getCommonStudents([
      'teacherken@gmail.com',
      'teacherjoe@gmail.com'
    ]);
    
    expect(response.status).toBe(200);
    expect(response.body.students).toContain('commonstudent1@gmail.com');
    expect(response.body.students).toContain('commonstudent2@gmail.com');
    expect(response.body.students.length).toBe(2);
  });
  
  it('should return 400 if teacher parameter is missing', async () => {
    const response = await request(app).get('/api/commonstudents');
    
    expect(response.status).toBe(400);
  });
  
  it('should return 400 if teacher email is invalid', async () => {
    const response = await request(app).get('/api/commonstudents?teacher=invalid-email');
    
    expect(response.status).toBe(400);
  });
});