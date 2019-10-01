import express from 'express';

import Users from './Users';
import Sessions from './Sessions';

const router = express.Router();

router.use('/users', Users);
router.use('/sessions', Sessions);

export default router;
