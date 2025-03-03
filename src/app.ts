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

export default app;
