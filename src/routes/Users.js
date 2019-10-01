import express from 'express';

import UserMiddleware from '../middlewares/Users';
import UserController from '../controllers/Users';

const router = express.Router();

router.post('/login', UserController.login);
router.post('/signup', UserMiddleware.validateData, UserMiddleware.checkIfEmailExists, UserMiddleware.encryptPassword, UserController.signUp);

export default router;
