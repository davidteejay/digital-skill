/* eslint-disable max-len */
import express from 'express';

import AuthMiddleware from '../middlewares/Auth';
import NotificationController from '../controllers/Notifications';
import NotificationMiddleware from '../middlewares/Notifications';

const router = express.Router();

router.get('/', AuthMiddleware.validateToken, NotificationController.getAll);
router.post('/mark/:id', AuthMiddleware.validateToken, NotificationMiddleware.checkIfIdExists, NotificationController.markAsRead);
router.delete('/:id', AuthMiddleware.validateToken, NotificationMiddleware.checkIfIdExists, NotificationController.delete);

export default router;
