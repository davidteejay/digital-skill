import express from 'express';

import Users from './Users';
import Sessions from './Sessions';
import Countries from './Countries';
import Reports from './Reports';

const router = express.Router();

router.use('/users', Users);
router.use('/sessions', Sessions);
router.use('/countries', Countries);
router.use('/reports', Reports);

export default router;
