import express from 'express';

import UserMiddleware from '../middlewares/Users';
import AuthMiddleware from '../middlewares/Auth';
import UserController from '../controllers/Users';

const router = express.Router();

router.post('/login', UserController.login);
router.post('/add', AuthMiddleware.validateToken, UserMiddleware.checkIfUserHasAccess, UserMiddleware.validateData, UserMiddleware.checkIfEmailExists, UserMiddleware.encryptPassword, UserController.addUser);

export default router;
