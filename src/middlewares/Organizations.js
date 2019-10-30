/* eslint-disable newline-per-chained-call */
/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
import Joi from 'joi';

import {
  serverError, incompleteDataError, notFoundError, accessDenied,
} from '../helpers/errors';
import db from '../models';

const { Organizations } = db;

export default class OrganizationMiddleware {
  static async validateData(req, res, next) {
    try {
      const schema = Joi.object().keys({
        name: Joi.string().trim().min(3).required(),
        shortName: Joi.string().trim().required(),
        country: Joi.string().trim().min(3).required(),
        website: Joi.string().trim().min(3).required(),
        email: Joi.string().email().trim().min(3).required(),
        phone: Joi.string().trim().min(5).required(),
        logo: Joi.optional(),
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

      if (type !== 'admin' && type !== 'super admin' && type !== 'googler') return accessDenied(res);

      return next();
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async checkIfIdExists(req, res, next) {
    try {
      const { id } = req.params;

      await Organizations
        .findByPk(id)
        .then((data) => {
          if (data === null) {
            return notFoundError(res, 'Organization Not Found');
          }

          req.data = {
            ...req.data,
            report: data.toJSON(),
          };

          return next();
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
