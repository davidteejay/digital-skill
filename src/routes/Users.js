import express from 'express';

import UserMiddleware from '../middlewares/Users';
import AuthMiddleware from '../middlewares/Auth';
import UserController from '../controllers/Users';

const router = express.Router();

router.post('/login', UserController.login);
router.post('/add', AuthMiddleware.validateToken, UserMiddleware.checkIfUserHasAccess, UserMiddleware.validateData, UserMiddleware.checkIfEmailExists, UserMiddleware.encryptPassword, UserController.addUser);
router.get('/dashboard', AuthMiddleware.validateToken, UserController.getDashboardData);

router
  .route('/:id')
  .get(AuthMiddleware.validateToken, UserMiddleware.checkIfIdExists, UserController.getOne)
  .put(AuthMiddleware.validateToken, UserMiddleware.checkIfIdExists, UserController.updateUser);

export default router;
