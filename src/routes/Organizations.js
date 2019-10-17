/* eslint-disable max-len */
import express from 'express';

import AuthMiddleware from '../middlewares/Auth';
import OrganizationMiddleware from '../middlewares/Organizations';
import OrganizationController from '../controllers/Organizations';

const router = express.Router();

router
  .route('/')
  .post(AuthMiddleware.validateToken, OrganizationMiddleware.checkIfUserHasAccess, OrganizationMiddleware.validateData, OrganizationController.add)
  .get(AuthMiddleware.validateToken, OrganizationMiddleware.checkIfUserHasAccess, OrganizationController.getAll);

router
  .route('/:id')
  .get(AuthMiddleware.validateToken, OrganizationMiddleware.checkIfUserHasAccess, OrganizationMiddleware.checkIfIdExists, OrganizationController.getOne)
  .put(AuthMiddleware.validateToken, OrganizationMiddleware.checkIfUserHasAccess, OrganizationMiddleware.checkIfIdExists, OrganizationController.update);

export default router;
