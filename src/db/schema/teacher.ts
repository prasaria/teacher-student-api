
// src/db/schema/teacher.ts
import { mysqlTable, int, varchar, timestamp } from 'drizzle-orm/mysql-core';

export const teachers = mysqlTable('teachers', {
    id: int('id').primaryKey().autoincrement(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
