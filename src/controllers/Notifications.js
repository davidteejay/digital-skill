/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import db from '../models';
import { serverError } from '../helpers/errors';

const { Notifications } = db;

export default class NotificationController {
  static async getAll(req, res) {
    try {
      const { auth: { id } } = req.data;

      await Notifications
        .findAll({
          where: { isDeleted: false },
          include: [{
            model: db.Users,
            as: 'by',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }],
        })
        .then(async (data) => {
          const notifications = [];
          await data.forEach((notification) => {
            if (notification.ids.split(',').includes(id)) {
              notifications.push({
                id: notification.id,
                title: notification.title,
                message: notification.message,
                isRead: notification.isRead,
                createdAt: notification.createdAt,
                updatedAt: notification.updatedAt,
                sessionId: notification.sessionId,
                by: notification.by,
              });
            }
          });

          return res.status(200).send({
            data: notifications,
            message: 'Notifications retrieved successfully',
            error: false,
          });
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async markAsRead(req, res) {
    try {
      const { id } = req.params;

      await Notifications
        .update({ isRead: true }, { returning: true, where: { id } })
        .then(([num, rows]) => res.status(200).send({
          data: rows[0],
          message: 'Notification updated Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      await Notifications
        .update({ isDeleted: true }, { returning: true, where: { id } })
        .then(() => res.status(200).send({
          data: null,
          message: 'Notification deleted Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
