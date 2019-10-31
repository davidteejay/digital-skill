/* eslint-disable prefer-const */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import db from '../models';
import { serverError, accessDenied, incompleteDataError } from '../helpers/errors';
import generateID from '../helpers/generateID';
import sendNotification from '../helpers/sendNotification';
import sendMail from '../helpers/sendMail';

const { Sessions } = db;

export default class SessionController {
  static async getAll(req, res) {
    try {
      let params = {};
      const { auth: { type, id, organizationId } } = req.data;

      if (type === 'partner') params = { organizationId };
      if (type === 'trainer') params = { trainerId: id };
      if (type === 'assessor') params = { assessorId: id };

      await Sessions
        .findAll({
          where: { ...req.query, ...params, isDeleted: false },
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
          }, {
            model: db.Organizations,
            as: 'organization',
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
      const { auth: { type, id, organizationId } } = req.data;

      if (type === 'partner') params = { organizationId };
      if (type === 'trainer') params = { trainerId: id };
      if (type === 'assessor') params = { assessorId: id };

      await Sessions
        .findAll({
          where: {
            ...req.query, ...params, accepted: true, status: 'approved', hasReport: true, isDeleted: false,
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
          }, {
            model: db.Organizations,
            as: 'organization',
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
      const { auth: { type, id, organizationId } } = req.data;

      if (type === 'partner') params = { organizationId };
      if (type === 'trainer') params = { trainerId: id };
      if (type === 'assessor') params = { assessorId: id };

      await Sessions
        .findAll({
          where: {
            ...req.query, ...params, accepted: true, status: 'approved', hasReport: false, isDeleted: false,
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
          }, {
            model: db.Organizations,
            as: 'organization',
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
      const { auth: { type, id, organizationId } } = req.data;
      let { query } = req;

      const { startDate, endDate } = query;

      delete query.startDate;
      delete query.endDate;

      if (type === 'partner') params = { organizationId };
      if (type === 'trainer') params = { trainerId: id };
      if (type === 'assessor') params = { assessorId: id };

      await Sessions
        .findAll({
          where: { ...query, ...params, isDeleted: false },
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
          }, {
            model: db.Organizations,
            as: 'organization',
          }],
        })
        .then(async (data) => {
          let sessions = [];
          if (startDate || endDate) {
            await data.forEach((session) => {
              const date = new Date(session.date).getTime();
              const start = new Date(startDate).getTime();

              if (start <= date) {
                if (endDate) {
                  const end = new Date(endDate).getTime();
                  if (date <= end) {
                    sessions.push(session);
                  }
                } else {
                  sessions.push(session);
                }
              }
            });
          } else sessions = data;

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
      const { auth: { organizationId, adminId } } = req.data;
      const userId = req.data.auth.id;

      await Sessions
        .update({ ...req.body }, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, [adminId], 'Session Updated', `Session ${id} has been updated`, id, userId, organizationId);
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
          type, id, adminId, organizationId,
        },
      } = req.data;
      const { location } = req.body;

      const date = new Date(req.body.date).getTime();
      const today = new Date().getTime();

      let ids = [];
      if (type === 'trainer') ids = [adminId];
      else ids = [adminId, req.body.trainerId];

      if (type === 'trainer' && date < today + (4 * 24 * 60 * 60 * 100)) return accessDenied(res, 'A session must be scheduled at least 4 days before the date');
      if (type === 'partner' && date < today + (2 * 24 * 60 * 60 * 100)) return accessDenied(res, 'A session must be scheduled at least 2 days before the date');

      await Sessions
        .create({
          ...req.body,
          trainerId: type === 'trainer' ? id : req.body.trainerId,
          organizationId: (type === 'trainer' || type === 'partner') ? organizationId : req.body.organizationId,
          createdBy: id,
          accepted: type === 'trainer',
          status: type === 'partner' || type === 'admin' ? 'approved' : 'awaiting approval',
        })
        .then(async (data) => {
          await sendNotification(res, ids, 'New Session', 'A New Session has been scheduled', data.id, id, organizationId);
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
      const { auth: { adminId, organizationId } } = req.data;
      const { id } = req.params;
      const userId = req.data.auth.id;

      await Sessions
        .update({ accepted: true }, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, [adminId], 'Session Accepted', `Session ${id} has been accepted`, id, userId, organizationId);
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
      const { auth: { adminId, organizationId }, session: { trainerId } } = req.data;
      const userId = req.data.auth.id;

      await Sessions
        .update({ status: 'approved' }, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, [trainerId, adminId], 'Session Approved', `Session ${id} has been approved`, id, userId, organizationId);
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
      const { auth: { adminId, organizationId, type }, session: { trainerId } } = req.data;
      const { id } = req.params;
      const { comment } = req.body;
      const userId = req.data.auth.id;

      await Sessions
        .update({ status: 'rejected', comment }, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, [trainerId, adminId], 'Session Rejected', `Session ${id} has been rejected by the ${type}`, id, userId, organizationId);
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
      const { auth: { adminId, organizationId }, session: { trainerId, date } } = req.data;
      const { id } = req.params;
      const { comment } = req.body;
      const sessionDate = new Date(date).getTime();
      const today = new Date().getTime();
      const userId = req.data.auth.id;

      if ((sessionDate - today) < (12 * 60 * 60 * 100)) return accessDenied(res, 'You can\'t cancel a session less than 12 hours before the session');

      await Sessions
        .update({ status: 'cancelled', comment }, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, [trainerId, adminId], 'Session Cancelled', `Session ${id} has been cancelled`, id, userId, organizationId);
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
      const { auth: { organizationId, adminId } } = req.data;
      const userId = req.data.auth.id;

      await Sessions
        .update(
          { clockInTime: new Date(), clockStatus: 'clocked in' },
          { returning: true, where: { id } },
        )
        .then(async ([num, rows]) => {
          await sendNotification(res, [adminId], 'Session Clocked In', `Session ${id} has been clocked in`, id, userId, organizationId);
          return res.status(200).send({
            data: {
              ...rows[0].toJSON(),
              media: rows[0].media ? JSON.parse(rows[0].media) : [],
              location: JSON.parse(rows[0].location),
            },
            message: 'Session Clocked in Successfully',
            error: false,
          });
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async clockOut(req, res) {
    try {
      const { id } = req.params;
      const userId = req.data.auth.id;
      const { auth: { organizationId, adminId } } = req.data;

      await Sessions
        .update(
          { clockOutTime: new Date(), clockStatus: 'clocked out' },
          { returning: true, where: { id } },
        )
        .then(async ([num, rows]) => {
          await sendNotification(res, [adminId], 'Session Clocked Out', `Session ${id} has been clocked out`, id, userId, organizationId);
          return res.status(200).send({
            data: {
              ...rows[0].toJSON(),
              media: rows[0].media ? JSON.parse(rows[0].media) : [],
              location: JSON.parse(rows[0].location),
            },
            message: 'Session Clocked out Successfully',
            error: false,
          });
        })
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

      if (media) {
        await media.forEach((item) => {
          previousMedia.push(item);
        });
      } else return incompleteDataError(res, 'media is required');

      await Sessions
        .update({ media: previousMedia }, { returning: true, where: { id } })
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

  static async sendReminder(req, res) {
    try {
      await Sessions
        .findAll({
          where: { status: 'approved', accepted: false, isDeleted: false },
          include: [{
            model: db.Users,
            as: 'trainer',
            attributes: ['id', 'email', 'firstName', 'lastName', 'type'],
          }],
        })
        .then(async (data) => {
          data.forEach(async (session) => {
            const { trainer: { firstName, lastName, email } } = session;
            const createdAt = new Date(session.createdAt).getTime();
            const now = new Date().getTime();

            const hours = (now - createdAt) / 3600000;

            if (Math.floor(hours) === 12) await sendMail('assignedSessionDelay', email, `${firstName} ${lastName}`, session);
          });

          return res.status(200).send({
            data: null,
            message: 'Reminders sent Successfully',
            error: false,
          });
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
