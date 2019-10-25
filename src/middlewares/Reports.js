/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
import Joi from 'joi';

import {
  serverError, incompleteDataError, notFoundError, accessDenied,
} from '../helpers/errors';
import db from '../models';

const { Sessions, Reports } = db;

export default class ReportMiddleware {
  static async validateData(req, res, next) {
    try {
      const schema = Joi.object().keys({
        sessionId: Joi.string().trim().min(3).required(),
        // images: Joi.array().items(Joi.string()).optional(),
        numberOfMale: Joi.number().required(),
        numberOfFemale: Joi.number().required(),
        totalNumber: Joi.number().required(),
        numberOfGMB: Joi.number().optional(),
        quote: Joi.string().min(3).required(),
        startTime: Joi.string().required(),
        endTime: Joi.string().required(),
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
      const { sessionId } = req.body;

      await Sessions
        .findByPk(sessionId)
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

  static async checkIfUserCanReport(req, res, next) {
    try {
      const { session: { date, time } } = req.data;

      const sessionDate = new Date(`${date}T${time}Z`);
      const now = new Date().getTime();
      sessionDate.setHours(sessionDate.getHours() + (sessionDate.getTimezoneOffset() / 60));

      if (now > sessionDate) return next();

      return accessDenied(res, 'You cannot report until it\'s time for the session');
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async changeSessionStatus(req, res, next) {
    try {
      const { sessionId } = req.body;

      await Sessions
        .update(
          { trainerStatus: 'waiting' },
          { where: { id: sessionId } },
        )
        .then(() => next())
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async updateSession(req, res, next) {
    try {
      const { sessionId } = req.body;

      await Sessions
        .update(
          { hasReport: true },
          { where: { id: sessionId } },
        )
        .then(() => next())
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async checkIfUserHasAccess(req, res, next) {
    try {
      const { auth: { type, id }, report: { partnerId } } = req.data;

      if ((type === 'partner' && id === partnerId) || type === 'admin') return next();

      return accessDenied(res);
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async checkIfUserCanRequestEdit(req, res, next) {
    try {
      const { auth: { type, id }, report: { partnerId } } = req.data;

      if (type === 'partner' && id === partnerId) return next();

      return accessDenied(res);
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async checkIfUserCanFlag(req, res, next) {
    try {
      const { auth: { type } } = req.data;

      if (type === 'admin') return next();

      return accessDenied(res);
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
