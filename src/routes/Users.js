import express from 'express';

import UserMiddleware from '../middlewares/Users';
import AuthMiddleware from '../middlewares/Auth';
import UserController from '../controllers/Users';

const router = express.Router();

router.get('/', AuthMiddleware.validateToken, UserMiddleware.checkIfUserHasAccess, UserController.getAll);
router.get('/refresh-token', AuthMiddleware.validateToken, UserController.refreshToken);
router.post('/login', UserController.login);
router.post('/reset', UserController.resetPassword);
router.post('/approve/:id', AuthMiddleware.validateToken, UserMiddleware.checkIfIdExists, UserController.approveUser);
router.post('/add', AuthMiddleware.validateToken, UserMiddleware.checkIfUserHasAccess, UserMiddleware.validateData, UserMiddleware.checkIfEmailExists, UserController.addUser);
router.get('/dashboard', AuthMiddleware.validateToken, UserController.getDashboardData);
router.post('/changePassword', AuthMiddleware.validateToken, UserController.changePassword);
router.post('/support', AuthMiddleware.validateToken, UserController.support);

router
  .route('/:id')
  .get(AuthMiddleware.validateToken, UserMiddleware.checkIfIdExists, UserController.getOne)
  .put(AuthMiddleware.validateToken, UserMiddleware.checkIfIdExists, UserController.updateUser)
  .delete(AuthMiddleware.validateToken, UserMiddleware.checkIfIdExists, UserController.deleteUser);

export default router;
