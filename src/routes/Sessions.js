/* eslint-disable max-len */
import express from 'express';

import AuthMiddleware from '../middlewares/Auth';
import SessionMiddleware from '../middlewares/Sessions';
import SessionController from '../controllers/Sessions';

const router = express.Router();

router.get('/', AuthMiddleware.validateToken, SessionController.getAll);
router.get('/with-reports', AuthMiddleware.validateToken, SessionController.getWithReports);
router.get('/without-reports', AuthMiddleware.validateToken, SessionController.getWithoutReports);

router.post('/schedule', AuthMiddleware.validateToken, SessionMiddleware.validateData, SessionController.schedule);
router.post('/accept/:id', AuthMiddleware.validateToken, SessionMiddleware.checkIfIdExists, SessionMiddleware.checkIfUserCanAccept, SessionController.accept);
router.post('/approve/:id', AuthMiddleware.validateToken, SessionMiddleware.checkIfIdExists, SessionMiddleware.checkIfUserHasAccess, SessionController.approve);
router.post('/reject/:id', AuthMiddleware.validateToken, SessionMiddleware.checkIfIdExists, SessionController.reject);
router.post('/clockin/:id', AuthMiddleware.validateToken, SessionMiddleware.checkIfIdExists, SessionMiddleware.checkIfUserCanClockIn, SessionMiddleware.checkIfSessionIsClockedIn, SessionController.clockIn);
router.post('/clockout/:id', AuthMiddleware.validateToken, SessionMiddleware.checkIfIdExists, SessionMiddleware.checkIfSessionIsClockedOut, SessionController.clockOut);

router
  .route('/:id')
  .get(AuthMiddleware.validateToken, SessionMiddleware.checkIfIdExists, SessionMiddleware.checkIfUserCanView, SessionController.getOne)
  .put(AuthMiddleware.validateToken, SessionMiddleware.checkIfIdExists, SessionMiddleware.checkIfUserCanView, SessionController.update)
  .delete(AuthMiddleware.validateToken, SessionMiddleware.checkIfIdExists, SessionMiddleware.checkIfUserCanView, SessionController.delete);

export default router;
