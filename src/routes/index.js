import express from 'express';

import Users from './Users';
import Sessions from './Sessions';
import Countries from './Countries';

const router = express.Router();

router.use('/users', Users);
router.use('/sessions', Sessions);
router.use('/countries', Countries);

export default router;
