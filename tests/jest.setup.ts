// tests/jest.setup.ts
import { setupTestDb, teardownTestDb } from './setup';

// Global setup before all tests
beforeAll(async () => {
  await setupTestDb();
});

// Global teardown after all tests
afterAll(async () => {
  await teardownTestDb();
});