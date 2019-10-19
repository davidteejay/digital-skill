/* eslint-disable max-len */
import express from 'express';

import AuthMiddleware from '../middlewares/Auth';
import ReportMiddleware from '../middlewares/Reports';
import ReportController from '../controllers/Reports';

const router = express.Router();

router.post('/add', AuthMiddleware.validateToken, ReportMiddleware.validateData, ReportMiddleware.checkIfSessionExists, ReportMiddleware.updateSession, ReportController.addReport);
router.post('/approve/:id', AuthMiddleware.validateToken, ReportMiddleware.checkIfIdExists, ReportMiddleware.checkIfUserHasAccess, ReportController.approve);
router.post('/reject/:id', AuthMiddleware.validateToken, ReportMiddleware.checkIfIdExists, ReportMiddleware.checkIfUserHasAccess, ReportController.reject);
router.post('/request-edit/:id', AuthMiddleware.validateToken, ReportMiddleware.checkIfIdExists, ReportMiddleware.checkIfUserCanRequestEdit, ReportController.requestEdit);
router.post('/flag/:id', AuthMiddleware.validateToken, ReportMiddleware.checkIfIdExists, ReportMiddleware.checkIfUserCanFlag, ReportController.flag);

router
  .route('/:id')
  .put(AuthMiddleware.validateToken, ReportMiddleware.checkIfIdExists, ReportController.updateReport);

export default router;
