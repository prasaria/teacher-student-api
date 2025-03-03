// src/api/index.ts
import { Router } from 'express';
import v1Routes from './v1/routes';

const router = Router();

router.use('/v1', v1Routes);
// Add health check at root level too
router.use('/health', v1Routes);

export default router;
