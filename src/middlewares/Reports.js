/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
import Joi from 'joi';

import {
  serverError, incompleteDataError, notFoundError,
} from '../helpers/errors';
import Sessions from '../models/Sessions';
import Reports from '../models/Reports';

export default class ReportMiddleware {
  static async validateData(req, res, next) {
    try {
      const schema = Joi.object().keys({
        session: Joi.string().trim().min(3).required(),
        images: Joi.array().items(Joi.string()).optional(),
        numberOfMale: Joi.number().optional(),
        numberOfFemale: Joi.number().optional(),
        numberOfGMB: Joi.number().optional(),
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

  static async checkIfIdExists(req, res, next) {
    try {
      const { id } = req.params;

      await Reports
        .findOne({ id, isDeleted: false })
        .then((data) => {
          if (data === null) {
            return notFoundError(res, 'Report Not Found');
          }

          req.data = {
            ...req.data,
            report: data,
          };

          return next();
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async checkIfSessionExists(req, res, next) {
    try {
      const { session } = req.body;

      await Sessions
        .findOne({ id: session, isDeleted: false })
        .then((data) => {
          if (data === null) {
            return notFoundError(res, 'Session Not Found');
          }

          req.data = {
            ...req.data,
            session: data,
          };

          return next();
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
