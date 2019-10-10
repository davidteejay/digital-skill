/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
import Joi from 'joi';

import {
  serverError, incompleteDataError, notFoundError,
} from '../helpers/errors';
import db from '../models';

const { Sessions, Reports } = db;

export default class ReportMiddleware {
  static async validateData(req, res, next) {
    try {
      const schema = Joi.object().keys({
        sessionId: Joi.string().trim().min(3).required(),
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
        .findByPk(id)
        .then((data) => {
          if (data === null) {
            return notFoundError(res, 'Report Not Found');
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

  static async checkIfSessionExists(req, res, next) {
    try {
      const { session } = req.body;

      await Sessions
        .findByPk(session)
        .then((data) => {
          if (data === null) {
            return notFoundError(res, 'Session Not Found');
          }

          req.data = {
            ...req.data,
            session: data.toJSON(),
          };

          return next();
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async changeSessionStatus(req, res, next) {
    try {
      const { session } = req.body;

      await Sessions
        .update(
          { trainerStatus: 'waiting' },
          { where: { id: session } },
        )
        .then(() => next())
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
