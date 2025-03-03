// tests/integration/api/v1/retrievefornotifications.test.ts
import { resetDatabase, createTestData } from '../../../helpers';
import { apiClient } from '../../../helpers';
import { getTestDb } from '../../../../src/db/test-db';
import { students } from '../../../../src/db/schema';
import { eq } from 'drizzle-orm';

describe('POST /api/retrievefornotifications', () => {
  beforeEach(async () => {
    await resetDatabase();
    await createTestData();
  });

  it('should get notification recipients including mentioned students', async () => {
    const response = await apiClient.retrieveForNotifications(
      'teacherken@gmail.com',
      'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com'
    );
    
    expect(response.status).toBe(200);
    expect(response.body.recipients).toContain('commonstudent1@gmail.com');
    expect(response.body.recipients).toContain('commonstudent2@gmail.com');
    expect(response.body.recipients).toContain('student_only_under_teacher_ken@gmail.com');
    expect(response.body.recipients).toContain('studentbob@gmail.com');
    expect(response.body.recipients).toContain('studentagnes@gmail.com');
    expect(response.body.recipients).toContain('studentmiche@gmail.com');
  });
  
  it('should not include suspended students', async () => {
    const db = await getTestDb();
    
    // Suspend a student
    await db
      .update(students)
      .set({ suspended: true })
      .where(eq(students.email, 'commonstudent1@gmail.com'));
    
    const response = await apiClient.retrieveForNotifications(
      'teacherken@gmail.com',
      'Hello students! @commonstudent1@gmail.com'
    );
    
    expect(response.status).toBe(200);
    expect(response.body.recipients).not.toContain('commonstudent1@gmail.com');
  });
  
  it('should return 400 if teacher email is invalid', async () => {
    const response = await apiClient.retrieveForNotifications(
      'invalid-email',
      'Hello students!'
    );
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid teacher email format');
  });
  
  it('should return 400 if notification is empty', async () => {
    const response = await apiClient.retrieveForNotifications(
      'teacherken@gmail.com',
      ''
    );
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Notification cannot be empty');
  });
});