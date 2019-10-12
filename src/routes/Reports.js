/* eslint-disable max-len */
import express from 'express';

import UploadMiddleware from '../middlewares/Upload';
import AuthMiddleware from '../middlewares/Auth';
import ReportMiddleware from '../middlewares/Reports';
import ReportController from '../controllers/Reports';

const router = express.Router();

router.post('/add', AuthMiddleware.validateToken, ReportMiddleware.validateData, ReportMiddleware.checkIfSessionExists, UploadMiddleware.uploadFiles, ReportMiddleware.updateSession, ReportController.addReport);
// router.post('/add', AuthMiddleware.validateToken, ReportMiddleware.validateData, ReportMiddleware.checkIfSessionExists, UploadMiddleware.uploadFiles, ReportMiddleware.changeSessionStatus, ReportController.addReport);

export default router;
