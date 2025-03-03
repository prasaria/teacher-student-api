// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './api';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Error handling
app.use(errorHandler);

// Handle 404 routes
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
