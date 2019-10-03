import express from 'express';

import UploadMiddleware from '../middlewares/Upload';
import AuthMiddleware from '../middlewares/Auth';
import ReportMiddleware from '../middlewares/Reports';
import ReportController from '../controllers/Reports';

const router = express.Router();

router.post('/add', AuthMiddleware.validateToken, ReportMiddleware.validateData, ReportMiddleware.checkIfSessionExists, UploadMiddleware.uploadFiles, ReportController.addReport);

export default router;
