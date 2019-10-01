/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
import Joi from 'joi';

import {
  serverError, incompleteDataError, notFoundError,
} from '../helpers/errors';
import Sessions from '../models/Sessions';

export default class SessionMiddleware {
  static async validateData(req, res, next) {
    try {
      const schema = Joi.object().keys({
        type: Joi.string().trim().min(3).required(),
        materials: Joi.string().trim().min(3).required(),
        date: Joi.date().min(new Date()).required(),
        time: Joi.string().trim().required(),
        trainerName: Joi.string().trim().min(3).required(),
        country: Joi.string().trim().min(3).required(),
        state: Joi.string().trim().min(3).required(),
        community: Joi.string().trim().min(3).required(),
        expectedNumber: Joi.number().min(0).required(),
        createdBy: Joi.string().trim().optional(),
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

      await Sessions
        .findOne({ id, isDeleted: false })
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
