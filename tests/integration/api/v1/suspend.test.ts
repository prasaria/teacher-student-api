// tests/integration/api/v1/suspend.test.ts
import { resetDatabase, createTestData } from '../../../helpers';
import { apiClient } from '../../../helpers';
import { getTestDb } from '../../../../src/db/test-db';
import { students } from '../../../../src/db/schema';
import { eq } from 'drizzle-orm';

describe('POST /api/suspend', () => {
  beforeEach(async () => {
    await resetDatabase();
    await createTestData();
  });

  it('should suspend a student', async () => {
    const response = await apiClient.suspendStudent('commonstudent1@gmail.com');
    
    expect(response.status).toBe(204);
    
    // Verify student is suspended in database
    const db = await getTestDb();
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.email, 'commonstudent1@gmail.com'));
    
    expect(student.suspended).toBe(true);
  });
  
  it('should return 400 if student email is invalid', async () => {
    const response = await apiClient.suspendStudent('invalid-email');
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid student email format');
  });
  
  it('should return 404 if student does not exist', async () => {
    const response = await apiClient.suspendStudent('nonexistent@gmail.com');
    
    expect(response.status).toBe(404);
  });
});