// src/db/migrate.ts
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db } from './index';

// This function runs all pending migrations
async function runMigrations() {
  console.log('Running migrations...');

  try {
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
  process.exit(0);
}

runMigrations();
