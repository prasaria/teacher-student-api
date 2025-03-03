// src/api/v1/routes/health.routes.ts
import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller';

const router = Router();

router.get('/', healthCheck);

export default router;
