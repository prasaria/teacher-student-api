// src/api/index.ts
import { Router } from 'express';
import v1Routes from './v1/routes';

const router = Router();

router.use('/v1', v1Routes);
// Mount v1 routes at root level for compatibility with specs
router.use('/', v1Routes);

export default router;
