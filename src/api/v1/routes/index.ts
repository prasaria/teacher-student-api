// src/api/v1/routes/index.ts
import { Router } from 'express';
import healthRoutes from './health.routes';
import teacherRoutes from './teacher.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/', teacherRoutes); // Mount teacher routes at the root

export default router;
