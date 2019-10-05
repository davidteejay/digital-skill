/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
import Joi from 'joi';

import {
  serverError, incompleteDataError, notFoundError, accessDenied,
} from '../helpers/errors';
import db from '../models';

const { Sessions } = db;

export default class SessionMiddleware {
  static async validateData(req, res, next) {
    try {
      const schema = Joi.object().keys({
        type: Joi.string().trim().min(3).required(),
        materials: Joi.string().trim().min(3).required(),
        date: Joi.date().min(new Date()).required(),
        time: Joi.string().trim().required(),
        trainer: Joi.string().trim().min(3).optional(),
        language: Joi.string().trim().optional(),
        country: Joi.string().trim().min(3).required(),
        state: Joi.string().trim().min(3).required(),
        community: Joi.string().trim().min(3).optional(),
        expectedNumber: Joi.number().min(0).required(),
        address: Joi.string().trim().min(3).required(),
        location: Joi.object({
          latitude: Joi.number().required(),
          longitude: Joi.number().required(),
        }).required(),
        audienceSelection: Joi.string().trim().min(3).required(),
        audienceDescription: Joi.string().trim().min(3).required(),
        audienceExpertLevel: Joi.string().trim().min(3).required(),
        natureOfTraining: Joi.string().trim().min(3).required(),
        photoWorthy: Joi.boolean().optional(),
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
        .findByPk(id)
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

  static async checkIfUserHasAccess(req, res, next) {
    try {
      const { auth: { type } } = req.data;

      if (type === 'partner' || type === 'admin' || type === 'super admin') return next();

      return accessDenied(res, 'You don\'t access to this feature');
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async checkIfUserCanClockIn(req, res, next) {
    try {
      const { session: { date } } = req.data;
      const today = new Date();

      if (today > new Date(date)) return accessDenied(res, 'You can\'t clock in yet');

      return next();
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async checkIfSessionIsClockedIn(req, res, next) {
    try {
      const { session: { clockStatus } } = req.data;

      if (clockStatus !== 'clocked in') return next();

      return accessDenied(res, 'This session has been clocked in already');
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async checkIfSessionIsClockedOut(req, res, next) {
    try {
      const { session: { clockStatus } } = req.data;

      if (clockStatus !== 'clocked out') return next();

      return accessDenied(res, 'This session has been clocked out already');
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
