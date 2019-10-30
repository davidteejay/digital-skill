/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
import Joi from 'joi';

import db from '../models';

import {
  serverError, incompleteDataError, alreadyExistsError, notFoundError,
  accessDenied,
} from '../helpers/errors';

const { Users } = db;

export default class UserMiddleware {
  static async validateData(req, res, next) {
    try {
      const schema = Joi.object().keys({
        type: Joi.string().trim().min(3).required(),
        partnerId: Joi.string().trim().min(3).optional(),
        firstName: Joi.string().trim().min(3).required(),
        lastName: Joi.string().trim().min(3).required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().min(6).required(),
        sex: Joi.string().trim().required(),
        phone: Joi.string().trim().required(),
        language: Joi.string().trim().optional(),
        country: Joi.string().trim().optional(),
        state: Joi.string().trim().optional(),
        community: Joi.string().trim().optional(),
      });

      await schema.validate(req.body, { abortEarly: false })
        .then(() => next())
        .catch((error) => {
          const errors = error.details.map((d) => d.message);
          return incompleteDataError(res, errors);
        });
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async checkIfUserHasAccess(req, res, next) {
    try {
      const { auth: { type } } = req.data;

      if (type === 'partner' || type === 'admin' || type === 'super admin' || type === 'googler'  || type === 'assessor manager') return next();

      return accessDenied(res, 'You don\'t access to this feature');
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async checkIfEmailExists(req, res, next) {
    try {
      const { email } = req.body;

      await Users
        .findOne({ where: { email, isDeleted: false } })
        .then((data) => {
          if (data === null) {
            return next();
          }

          return alreadyExistsError(res, 'Email Already Exists');
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async checkIfIdExists(req, res, next) {
    try {
      const { id } = req.params;

      await Users
        .findByPk(id)
        .then((data) => {
          if (data === null) {
            return notFoundError(res, 'User Not Found');
          }

          req.data = {
            ...req.data,
            user: data,
          };

          return next();
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
