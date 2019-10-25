/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import db from '../models';
import { serverError, incompleteDataError } from '../helpers/errors';
import generateID from '../helpers/generateID';
import sendNotification from '../helpers/sendNotification';

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
            attributes: ['id', 'email', 'firstName', 'lastName', 'type'],
          }, {
            model: db.Users,
            as: 'sessionCreatedBy',
            attributes: ['id', 'email', 'firstName', 'lastName', 'type'],
          }, {
            model: db.Users,
            as: 'assessor',
            attributes: ['id', 'email', 'firstName', 'lastName', 'type'],
          }, {
            model: db.Reports,
            as: 'report',
          }],
        })
        .then(async (data) => {
          const sessions = [];
          data.forEach((session) => {
            session = {
              ...session.toJSON(),
              media: session.media ? JSON.parse(session.media) : [],
              location: JSON.parse(session.location),
            };
            sessions.push(session);
          });

          return res.status(200).send({
            data: sessions.sort((a, b) => b.createdAt - a.createdAt),
            message: 'Sessions Fetched Successfully',
            error: false,
          });
        })
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
            ...req.params, ...params, accepted: true, status: 'approved', hasReport: true, isDeleted: false,
          },
          include: [{
            model: db.Users,
            as: 'trainer',
            attributes: ['id', 'email', 'firstName', 'lastName', 'type'],
          }, {
            model: db.Users,
            as: 'sessionCreatedBy',
            attributes: ['id', 'email', 'firstName', 'lastName', 'type'],
          }, {
            model: db.Users,
            as: 'assessor',
            attributes: ['id', 'email', 'firstName', 'lastName', 'type'],
          }, {
            model: db.Reports,
            as: 'report',
          }],
        })
        .then(async (data) => {
          const sessions = [];
          data.forEach((session) => {
            session = {
              ...session.toJSON(),
              media: session.media ? JSON.parse(session.media) : [],
              location: JSON.parse(session.location),
            };
            sessions.push(session);
          });

          return res.status(200).send({
            data: sessions.sort((a, b) => b.createdAt - a.createdAt),
            message: 'Sessions Fetched Successfully',
            error: false,
          });
        })
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
            ...req.params, ...params, accepted: true, status: 'approved', hasReport: false, isDeleted: false,
          },
          include: [{
            model: db.Users,
            as: 'trainer',
            attributes: ['id', 'email', 'firstName', 'lastName', 'type'],
          }, {
            model: db.Users,
            as: 'sessionCreatedBy',
            attributes: ['id', 'email', 'firstName', 'lastName', 'type'],
          }, {
            model: db.Users,
            as: 'assessor',
            attributes: ['id', 'email', 'firstName', 'lastName', 'type'],
          }, {
            model: db.Reports,
            as: 'report',
          }],
        })
        .then(async (data) => {
          const sessions = [];
          data.forEach((session) => {
            session = {
              ...session.toJSON(),
              media: session.media ? JSON.parse(session.media) : [],
              location: JSON.parse(session.location),
            };
            sessions.push(session);
          });

          return res.status(200).send({
            data: sessions.sort((a, b) => b.createdAt - a.createdAt),
            message: 'Sessions Fetched Successfully',
            error: false,
          });
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async filter(req, res) {
    try {
      let params = {};
      const { auth: { type, id } } = req.data;
      const { startDate, endDate } = req.query;

      if (type === 'partner') params = { partnerId: id };
      if (type === 'trainer') params = { trainerId: id };
      if (type === 'assessor') params = { assessorId: id };

      await Sessions
        .findAll({
          where: { ...req.params, ...params, isDeleted: false },
          include: [{
            model: db.Users,
            as: 'trainer',
            attributes: ['id', 'email', 'firstName', 'lastName', 'type'],
          }, {
            model: db.Users,
            as: 'sessionCreatedBy',
            attributes: ['id', 'email', 'firstName', 'lastName', 'type'],
          }, {
            model: db.Users,
            as: 'assessor',
            attributes: ['id', 'email', 'firstName', 'lastName', 'type'],
          }, {
            model: db.Reports,
            as: 'report',
          }],
        })
        .then(async (data) => {
          const sessions = [];
          await data.forEach((session) => {
            const date = new Date(session.date).getTime();
            const start = new Date(startDate).getTime();

            if (start <= date) {
              if (endDate) {
                const end = new Date(endDate).getTime();
                if (date <= end) sessions.push(session);
              } else {
                sessions.push(session);
              }
            }
          });

          return res.status(200).send({
            data: sessions,
            message: 'Sessions Fetched Successfully',
            error: false,
          });
        })
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
            attributes: ['id', 'email', 'firstName', 'lastName', 'type'],
          }, {
            model: db.Users,
            as: 'sessionCreatedBy',
            attributes: ['id', 'email', 'firstName', 'lastName', 'type'],
          }, {
            model: db.Users,
            as: 'assessor',
            attributes: ['id', 'email', 'firstName', 'lastName', 'type'],
          }, {
            model: db.Reports,
            as: 'report',
          }],
        })
        .then((data) => res.status(200).send({
          data: {
            ...data.toJSON(),
            media: data.media ? JSON.parse(data.media) : [],
            location: JSON.parse(data.location),
          },
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
      const { auth: { partnerId, adminId } } = req.data;

      await Sessions
        .update({ ...req.body }, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, [partnerId, adminId], 'Session Updated', `Session ${id} has been updated`);
          return res.status(200).send({
            data: {
              ...rows[0].toJSON(),
              media: rows[0].media ? JSON.parse(rows[0].media) : [],
              location: JSON.parse(rows[0].location),
            },
            message: 'Session updated Successfully',
            error: false,
          });
        })
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
      const {
        auth: {
          type, id, partnerId, adminId,
        },
      } = req.data;
      const { location } = req.body;
      const sessionId = await generateID(res, Sessions);

      const date = new Date(req.body.date).getTime();
      const today = new Date().getTime();

      let ids = [];
      if (type === 'trainer') ids = [adminId, partnerId];
      else ids = [adminId, req.body.trainerId];

      if (type === 'trainer' && date < today + (4 * 24 * 60 * 60 * 100)) return incompleteDataError(res, 'A session must be scheduled at least 4 days before the date');
      if (type === 'partner' && date < today + (2 * 24 * 60 * 60 * 100)) return incompleteDataError(res, 'A session must be scheduled at least 2 days before the date');

      await Sessions
        .create({
          ...req.body,
          trainerId: type === 'trainer' ? id : req.body.trainerId,
          partnerId: type === 'trainer'
            ? partnerId
            : type === 'partner'
              ? id
              : req.body.partnerId,
          createdBy: id,
          id: sessionId,
          accepted: type === 'trainer',
          status: type === 'partner' ? 'approved' : 'awaiting approval',
        })
        .then(async (data) => {
          await sendNotification(res, ids, 'New Session', 'A New Session has been scheduled');
          return res.status(200).send({
            data: {
              ...data.toJSON(),
              location,
            },
            message: 'Session Scheduled Successfully',
            error: false,
          });
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async accept(req, res) {
    try {
      const { auth: { partnerId, adminId } } = req.data;
      const { id } = req.params;

      await Sessions
        .update({ accepted: true }, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, [partnerId, adminId], 'Session Accepted', `Session ${id} has been accepted`);
          return res.status(200).send({
            data: {
              ...rows[0].toJSON(),
              media: rows[0].media ? JSON.parse(rows[0].media) : [],
              location: JSON.parse(rows[0].location),
            },
            message: 'Session accepted Successfully',
            error: false,
          });
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async approve(req, res) {
    try {
      const { id } = req.params;
      const { auth: { adminId }, session: { trainerId } } = req.data;

      await Sessions
        .update({ status: 'approved' }, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, [trainerId, adminId], 'Session Approved', `Session ${id} has been approved`);
          return res.status(200).send({
            data: {
              ...rows[0].toJSON(),
              media: rows[0].media ? JSON.parse(rows[0].media) : [],
              location: JSON.parse(rows[0].location),
            },
            message: 'Session approved Successfully',
            error: false,
          });
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async reject(req, res) {
    try {
      const { auth: { adminId, type }, session: { trainerId, partnerId } } = req.data;
      const { id } = req.params;

      await Sessions
        .update({ status: 'rejected' }, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, [trainerId, adminId, partnerId], 'Session Rejected', `Session ${id} has been rejected`);
          return res.status(200).send({
            data: {
              ...rows[0].toJSON(),
              media: rows[0].media ? JSON.parse(rows[0].media) : [],
              location: JSON.parse(rows[0].location),
            },
            message: 'Session rejected Successfully',
            error: false,
          });
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async cancel(req, res) {
    try {
      const { auth: { adminId }, session: { trainerId, partnerId } } = req.data;
      const { id } = req.params;

      await Sessions
        .update({ status: 'cancelled' }, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, [trainerId, adminId, partnerId], 'Session Cancelled', `Session ${id} has been cancelled`);
          return res.status(200).send({
            data: {
              ...rows[0].toJSON(),
              media: rows[0].media ? JSON.parse(rows[0].media) : [],
              location: JSON.parse(rows[0].location),
            },
            message: 'Session rejected Successfully',
            error: false,
          });
        })
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
          data: {
            ...rows[0].toJSON(),
            media: rows[0].media ? JSON.parse(rows[0].media) : [],
            location: JSON.parse(rows[0].location),
          },
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
          data: {
            ...rows[0].toJSON(),
            media: rows[0].media ? JSON.parse(rows[0].media) : [],
            location: JSON.parse(rows[0].location),
          },
          message: 'Session Clocked out Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async uploadMedia(req, res) {
    try {
      const { id } = req.params;
      const previousMedia = req.data.session.media ? JSON.parse(req.data.session.media) : [];
      const { media } = req.body;

      await media.push(previousMedia);

      await Sessions
        .update({ media }, { returning: true, where: { id } })
        .then(([num, rows]) => res.status(200).send({
          data: {
            ...rows[0].toJSON(),
            media: rows[0].media ? JSON.parse(rows[0].media) : [],
            location: JSON.parse(rows[0].location),
          },
          message: 'Media added Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
