/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import db from '../models';
import { serverError, incompleteDataError } from '../helpers/errors';
import generateID from '../helpers/generateID';

const { Sessions } = db;

export default class SessionController {
  static async getAll(req, res) {
    try {
      let params = {};
      const { auth: { type, id } } = req.data;

      if (type === 'partner') params = { partnerId: id };
      if (type === 'trainer') params = { trainerId: id };
      if (type === 'assessor') params = { assessorId: id };

      await Sessions
        .findAll({
          where: { ...req.params, ...params, isDeleted: false },
          include: [{
            model: db.Users,
            as: 'trainer',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }, {
            model: db.Users,
            as: 'sessionCreatedBy',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }, {
            model: db.Users,
            as: 'assessor',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }, {
            model: db.Reports,
            as: 'reports',
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

  static async getWithReports(req, res) {
    try {
      let params = {};
      const { auth: { type, id } } = req.data;

      if (type === 'partner') params = { partnerId: id };
      if (type === 'trainer') params = { trainerId: id };
      if (type === 'assessor') params = { assessorId: id };

      await Sessions
        .findAll({
          where: {
            ...req.params, ...params, accepted: true, trainerStatus: 'done', hasReport: true, isDeleted: false,
          },
          include: [{
            model: db.Users,
            as: 'trainer',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }, {
            model: db.Users,
            as: 'sessionCreatedBy',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }, {
            model: db.Users,
            as: 'assessor',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }, {
            model: db.Reports,
            as: 'reports',
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

  static async getWithoutReports(req, res) {
    try {
      let params = {};
      const { auth: { type, id } } = req.data;

      if (type === 'partner') params = { partnerId: id };
      if (type === 'trainer') params = { trainerId: id };
      if (type === 'assessor') params = { assessorId: id };

      await Sessions
        .findAll({
          where: {
            ...req.params, ...params, accepted: true, trainerStatus: 'done', hasReport: false, isDeleted: false,
          },
          include: [{
            model: db.Users,
            as: 'trainer',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }, {
            model: db.Users,
            as: 'sessionCreatedBy',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }, {
            model: db.Users,
            as: 'assessor',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }, {
            model: db.Reports,
            as: 'reports',
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

  static async getOne(req, res) {
    try {
      const { id } = req.params;

      await Sessions
        .findByPk(id, {
          include: [{
            model: db.Users,
            as: 'trainer',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }, {
            model: db.Users,
            as: 'sessionCreatedBy',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }, {
            model: db.Users,
            as: 'assessor',
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

  static async update(req, res) {
    try {
      const { id } = req.params;

      await Sessions
        .update({ ...req.body }, { returning: true, where: { id } })
        .then(([num, rows]) => res.status(200).send({
          data: rows[0],
          message: 'Session updated Successfully',
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

      await Sessions
        .update({ isDeleted: true }, { returning: true, where: { id } })
        .then(() => res.status(200).send({
          data: null,
          message: 'Session deleted Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async schedule(req, res) {
    try {
      const { auth: { type, id, partnerId } } = req.data;
      const sessionId = await generateID(res, Sessions);

      const date = new Date(req.body.date).getTime();
      const today = new Date().getTime();

      if (date < today + (4 * 24 * 60 * 60 * 100)) return incompleteDataError(res, 'A session must be scheduled at leat 4 days before the date');

      await Sessions
        .create({
          ...req.body,
          trainerId: type === 'trainer' ? id : req.body.trainerId,
          partnerId: type === 'trainer'
            ? partnerId
            : type === 'partner'
              ? id
              : req.body.partnerStatus,
          createdBy: id,
          id: sessionId,
          accepted: type === 'trainer',
          partnerStatus: type === 'partner' ? 'waiting' : 'no_action',
          trainerStatus: type === 'partner' ? 'done' : 'waiting',
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

  static async accept(req, res) {
    try {
      const { auth: { type } } = req.data;
      const { id } = req.params;

      await Sessions
        .update({ accepted: true, partnerStatus: 'waiting' }, { returning: true, where: { id } })
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
