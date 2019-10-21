/* eslint-disable newline-per-chained-call */
/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
import {
  serverError, notFoundError,
} from '../helpers/errors';
import db from '../models';

const { Notifications } = db;

export default class NotificationMiddleware {
  static async checkIfIdExists(req, res, next) {
    try {
      const { id } = req.params;

      await Notifications
        .findByPk(id)
        .then((data) => {
          if (data === null) {
            return notFoundError(res, 'Notification Not Found');
          }

          req.data = {
            ...req.data,
            notification: data.toJSON(),
          };

          return next();
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
