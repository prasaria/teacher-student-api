// src/api/v1/controllers/health.controller.ts
import { Request, Response } from 'express';
import { sql } from 'drizzle-orm';
import { db } from '../../../db';

export const healthCheck = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Test database connection
    await db.execute(sql`SELECT 1`);

    res.status(200).json({
      status: 'ok',
      message: 'API is running',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'API is running but database connection failed',
      timestamp: new Date().toISOString(),
    });
  }
};
