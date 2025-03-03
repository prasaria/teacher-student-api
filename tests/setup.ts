// tests/setup.ts
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../src/db/schema';
import { testEnv } from '../src/config/test.env';

// Global connection objects
let connection: mysql.Connection;
let db: ReturnType<typeof drizzle>;

// Setup function before all tests
export const setupTestDb = async () => {
  try {
    console.log('Setting up test database...');
    
    // Create connection to MySQL without specifying a database
    const rootConnection = await mysql.createConnection({
      host: testEnv.TEST_DB_HOST,
      port: testEnv.TEST_DB_PORT,
      user: testEnv.TEST_DB_USER,
      password: testEnv.TEST_DB_PASSWORD,
    });

    // Drop and recreate the test database
    console.log(`Recreating database: ${testEnv.TEST_DB_NAME}`);
    await rootConnection.query(`DROP DATABASE IF EXISTS ${testEnv.TEST_DB_NAME}`);
    await rootConnection.query(`CREATE DATABASE ${testEnv.TEST_DB_NAME}`);
    await rootConnection.end();

    // Connect to the test database
    connection = await mysql.createConnection({
      host: testEnv.TEST_DB_HOST,
      port: testEnv.TEST_DB_PORT,
      user: testEnv.TEST_DB_USER,
      password: testEnv.TEST_DB_PASSWORD,
      database: testEnv.TEST_DB_NAME,
    });

    // Initialize Drizzle with the test database
    db = drizzle(connection, { schema, mode: 'default' });

    // Create the tables manually since migrations might not be working
    console.log('Creating database tables...');
    
    // Create teachers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create students table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        suspended BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create teacher_students table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teacher_students (
        teacher_id INT NOT NULL,
        student_id INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (teacher_id, student_id),
        FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);
    
    console.log('Test database setup complete');
    
    return { db, connection };
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
};

// Teardown function after all tests
export const teardownTestDb = async () => {
  try {
    console.log('Tearing down test database...');
    if (connection) {
      await connection.end();
      console.log('Test database teardown complete');
    }
  } catch (error) {
    console.error('Error tearing down test database:', error);
  }
};

// Reset database between tests
export const resetTestDb = async () => {
  console.log('Resetting test database...');
  if (connection) {
    // Clear all tables
    await connection.query('DELETE FROM teacher_students');
    await connection.query('DELETE FROM students');
    await connection.query('DELETE FROM teachers');
  }
};