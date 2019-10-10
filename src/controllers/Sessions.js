/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import db from '../models';
import { serverError } from '../helpers/errors';
import generateID from '../helpers/generateID';

const { Sessions } = db;

export default class SessionController {
  static async getAll(req, res) {
    try {
      await Sessions
        .findAll({
          where: { ...req.params, isDeleted: false },
          include: [{
            model: db.Users,
            as: 'trainer',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }, {
            model: db.Users,
            as: 'sessionCreatedBy',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }],
        })
        .then((data) => res.status(200).send({
          data,
          message: 'Sessions Fetched Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async schedule(req, res) {
    try {
      const { auth: { type, id } } = req.data;
      const sessionId = await generateID(res, Sessions);

      await Sessions
        .create({
          ...req.body,
          trainerId: type === 'trainer' ? id : req.body.trainerId,
          createdBy: id,
          id: sessionId,
        })
        .then((data) => res.status(200).send({
          data,
          message: 'Session Scheduled Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async approve(req, res) {
    try {
      const { auth: { type } } = req.data;
      const { id } = req.params;

      let update = {};
      if (type === 'partner') update = { trainerStatus: 'done', partnerStatus: 'waiting' };
      else if (type === 'admin') update = { partnerStatus: 'done', adminStatus: 'waiting' };
      else update = { adminStatus: 'done' };

      await Sessions
        .update(update, { returning: true, where: { id } })
        .then(([num, rows]) => res.status(200).send({
          data: rows[0],
          message: 'Session approved Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async reject(req, res) {
    try {
      const { auth: { type } } = req.data;
      const { id } = req.params;

      let update = {};
      if (type === 'partner') update = { trainerStatus: 'failed' };
      else if (type === 'admin') update = { partnerStatus: 'failed' };
      else update = { adminStatus: 'failed' };

      await Sessions
        .update(update, { returning: true, where: { id } })
        .then(([num, rows]) => res.status(200).send({
          data: rows[0],
          message: 'Session rejected Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async clockIn(req, res) {
    try {
      const { id } = req.params;

      await Sessions
        .update(
          { clockInTime: new Date(), clockStatus: 'clocked in' },
          { returning: true, where: { id } },
        )
        .then(([num, rows]) => res.status(200).send({
          data: rows[0],
          message: 'Session Clocked in Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async clockOut(req, res) {
    try {
      const { id } = req.params;

      await Sessions
        .update(
          { clockOutTime: new Date(), clockStatus: 'clocked out' },
          { returning: true, where: { id } },
        )
        .then(([num, rows]) => res.status(200).send({
          data: rows[0],
          message: 'Session Clocked out Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
