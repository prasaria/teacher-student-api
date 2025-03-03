// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './api';
import { errorHandler, requestLogger } from './middlewares/error.middleware';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging
app.use(requestLogger);

// API routes
app.use('/api', apiRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling (must be last)
app.use(errorHandler);

export default app;
