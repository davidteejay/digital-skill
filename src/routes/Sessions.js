import express from 'express';

import AuthMiddleware from '../middlewares/Auth';
import SessionMiddleware from '../middlewares/Sessions';
import SessionController from '../controllers/Sessions';

const router = express.Router();

router.get('/', AuthMiddleware.validateToken, SessionController.getAll);
router.post('/schedule', AuthMiddleware.validateToken, SessionMiddleware.validateData, SessionController.schedule);
router.post('/approve/:id', AuthMiddleware.validateToken, SessionMiddleware.checkIfIdExists, SessionMiddleware.checkIfUserHasAccess, SessionController.approve);
router.post('/reject/:id', AuthMiddleware.validateToken, SessionMiddleware.checkIfIdExists, SessionMiddleware.checkIfUserHasAccess, SessionController.reject);
router.post('/clockin/:id', AuthMiddleware.validateToken, SessionMiddleware.checkIfIdExists, SessionMiddleware.checkIfUserCanClockIn, SessionMiddleware.checkIfSessionIsClockedIn, SessionController.clockIn);
router.post('/clockout/:id', AuthMiddleware.validateToken, SessionMiddleware.checkIfIdExists, SessionMiddleware.checkIfSessionIsClockedOut, SessionController.clockOut);

export default router;
