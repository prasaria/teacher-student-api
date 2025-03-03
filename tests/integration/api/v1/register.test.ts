// tests/integration/api/v1/register.test.ts
import { resetDatabase } from '../../../helpers';
import { apiClient } from '../../../helpers';

describe('POST /api/register', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it('should register students to a teacher', async () => {
    const response = await apiClient.registerStudents(
      'teacherken@gmail.com',
      ['studentjon@gmail.com', 'studenthon@gmail.com']
    );
    
    expect(response.status).toBe(204);
  });
  
  it('should return 400 if teacher email is invalid', async () => {
    const response = await apiClient.registerStudents(
      'invalid-email',
      ['studentjon@gmail.com']
    );
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid teacher email format');
  });
  
  it('should return 400 if student email is invalid', async () => {
    const response = await apiClient.registerStudents(
      'teacherken@gmail.com',
      ['invalid-email']
    );
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid student email format');
  });
  
  it('should return 400 if students array is empty', async () => {
    const response = await apiClient.registerStudents(
      'teacherken@gmail.com',
      []
    );
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('At least one student must be provided');
  });
});