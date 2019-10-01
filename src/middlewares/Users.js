/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
import Joi from 'joi';
import crypto from 'crypto';

import Users from '../models/Users';
import {
  serverError, incompleteDataError, alreadyExistsError, notFoundError,
} from '../helpers/errors';

export default class UserMiddleware {
  static async validateData(req, res, next) {
    try {
      const schema = Joi.object().keys({
        type: Joi.string().trim().optional(),
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

  static async checkIfEmailExists(req, res, next) {
    try {
      const { email } = req.body;

      await Users.findOne({ email, isDeleted: false })
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
        .findOne({ id, isDeleted: false })
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

  static async encryptPassword(req, res, next) {
    try {
      const { password } = req.body;

      const salt = await crypto.randomBytes(16).toString('hex');
      const hash = await crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');

      req.data = {
        ...req.data,
        hash,
        salt,
      };

      return next();
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
