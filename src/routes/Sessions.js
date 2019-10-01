import express from 'express';

import AuthMiddleware from '../middlewares/Auth';
import SessionMiddleware from '../middlewares/Sessions';
import SessionController from '../controllers/Sessions';

const router = express.Router();

router.get('/', AuthMiddleware.validateToken, SessionController.getAll);
router.post('/schedule', AuthMiddleware.validateToken, SessionMiddleware.validateData, SessionController.schedule);

export default router;
