// src/db/schema/student.ts
import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/mysql-core';

export const students = mysqlTable('students', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  suspended: boolean('suspended').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
