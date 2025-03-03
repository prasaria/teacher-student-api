// src/db/test-db.ts
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import { testEnv } from '../config/test.env';

// Connection pool for test database
let pool: mysql.Pool | null = null;

// Create test connection
export const createTestConnection = async () => {
  try {
    if (!pool) {
      pool = mysql.createPool({
        host: testEnv.TEST_DB_HOST,
        port: testEnv.TEST_DB_PORT,
        user: testEnv.TEST_DB_USER,
        password: testEnv.TEST_DB_PASSWORD,
        database: testEnv.TEST_DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }

    const db = drizzle(pool, { schema, mode: 'default' });
    return { db, pool };
  } catch (error) {
    console.error('Error creating test database connection:', error);
    throw error;
  }
};

// Export test database instance
export const getTestDb = async () => {
  const { db } = await createTestConnection();
  return db;
};

// Helper to close connection
export const closeTestConnection = async () => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};
