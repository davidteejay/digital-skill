/* eslint-disable max-len */
/* eslint-disable prefer-template */
/* eslint-disable no-unused-vars */
/* eslint-disable radix */
/* eslint-disable consistent-return */
import axios from 'axios';
import debug from 'debug';

import db from '../models';
import { serverError, incompleteDataError } from '../helpers/errors';
import generateID from '../helpers/generateID';
import sendNotification from '../helpers/sendNotification';
import sendMail from '../helpers/sendMail';

const { BigQuery } = require('@google-cloud/bigquery');

const bigquery = new BigQuery();

const { Reports, Users, Organizations } = db;

export default class ReportController {
  static async addReport(req, res) {
    try {
      const { auth: { id, organizationId, adminId }, images } = req.data;
      const reportId = await generateID(res, Reports);

      const {
        numberOfMale, numberOfFemale, totalNumber, sessionId,
      } = req.body;

      if (parseInt(totalNumber) !== parseInt(numberOfFemale) + parseInt(numberOfMale)) return incompleteDataError(res, 'total number must be the sum of total male and total female');

      await Reports
        .create({
          ...req.body,
          id: reportId,
          trainerId: id,
          organizationId,
          images,
        })
        .then(async (data) => {
          await sendNotification(res, [adminId], 'New Report', `A new report has been sent for Session ${sessionId}`, sessionId, id, organizationId);
          await Organizations
            .findByPk(organizationId, {
              include: [{
                model: db.Users,
                as: 'users',
              }],
            })
            .then(async (data_) => {
              const { users } = data_;
              await users.forEach(async (user) => {
                if (user.type === 'parter') await sendMail('reportSession', data_.email, `${data_.firstName} ${data_.lastName}`, data_);
              });
            });

          return res.status(200).send({
            data: {
              ...data.toJSON(),
              images,
            },
            message: 'Report sent successfully',
            error: false,
          });
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async updateReport(req, res) {
    try {
      const { id } = req.params;
      const { auth: { adminId, organizationId } } = req.data;
      const userId = req.data.auth.id;

      await Reports
        .update({ ...req.body, partnerStatus: 'pending', adminStatus: 'pending' }, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, [adminId], 'Report Updated', `Report ${id} for Session ${rows[0].sessionId} has been updated`, rows[0].sessionId, userId, organizationId);
          return res.status(200).send({
            data: rows[0],
            message: 'Report updated Successfully',
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
      const {
        auth: { type, adminId, organization }, report: {
          sessionId, trainerId, session,
          totalNumber, numberOfFemale, numberOfMale, numberOfGMB,
        },
      } = req.data;
      const userId = req.data.auth.id;
      const { name } = organization;

      let update = {};
      let message = '';
      let ids = [];
      if (type === 'partner') {
        update = { partnerStatus: 'approved' };
        message = `Report ${id} for Session ${sessionId} has been approved by partner`;
        ids = [adminId, trainerId];
      } else {
        update = { adminStatus: 'approved' };
        message = `Report ${id} for Session ${sessionId} has been approved by admin`;
        ids = [trainerId];

        const data = [{
          Training_year: new Date(session.date).getFullYear(),
          Month: `${new Date(session.date).getFullYear()}-${new Date(session.date).getMonth() > 8 ? new Date(session.date).getMonth() + 1 : '0' + (new Date(session.date).getMonth() + 1)}-01`,
          Category: session.audienceSelection,
          Partner: name,
          Attendee: totalNumber,
          Female: numberOfFemale,
          Male: numberOfMale,
          Country: session.country,
          Businesses_verified_on_GMB: numberOfGMB,
        }];

        await bigquery.dataset('Google_Digital_Skills_Data').table('DigitalSkillsData').insert(data);
      }

      await Reports
        .update({ ...update, comment: null }, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, ids, 'Report Approved', message, sessionId, userId, organization.id);
          return res.status(200).send({
            data: rows[0],
            message: 'Report approved Successfully',
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
      const { id } = req.params;
      const { auth: { type, organizationId, adminId }, report: { sessionId, trainerId } } = req.data;
      const { comment } = req.body;
      const userId = req.data.auth.id;

      let update = {};
      let message = '';
      let ids = [];
      if (type === 'partner') {
        update = { partnerStatus: 'rejected', comment };
        message = `Report ${id} for Session ${sessionId} has been rejected by partner`;
        ids = [adminId, trainerId];
      } else {
        update = { adminStatus: 'rejected' };
        message = `Report ${id} for Session ${sessionId} has been rejected by admin`;
        ids = [trainerId];
      }

      await Reports
        .update(update, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, ids, 'Report Rejected', message, sessionId, userId, organizationId);
          return res.status(200).send({
            data: rows[0],
            message: 'Report rejected Successfully',
            error: false,
          });
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async requestEdit(req, res) {
    try {
      const { id } = req.params;
      const { auth: { adminId, organizationId }, report: { sessionId, trainerId } } = req.data;
      const { comment } = req.body;
      const userId = req.data.auth.id;

      await Reports
        .update({ partnerStatus: 'requested edit', comment }, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, [adminId, trainerId], 'Edit Requested', `The partner requested edit for Report ${id} in Session ${sessionId}`, sessionId, userId, organizationId);
          return res.status(200).send({
            data: rows[0],
            message: 'Requested edit Successfully',
            error: false,
          });
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async flag(req, res) {
    try {
      const { id } = req.params;
      const { auth: { organizationId }, report: { sessionId, trainerId } } = req.data;
      const { comment } = req.body;
      const userId = req.data.auth.id;

      await Reports
        .update({ adminStatus: 'flagged', comment }, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, [trainerId], 'Report flagged', `The admin flagged Report ${id} in Session ${sessionId}`, sessionId, userId, organizationId);
          await Users
            .findOne({
              where: { id: trainerId },
              include: [{
                model: db.Users,
                as: 'admin',
                attributes: ['id', 'email', 'firstName', 'lastName'],
              }, {
                model: db.Organizations,
                as: 'organization',
              }],
            })
            .then(async (data) => sendMail('flagReport', data.email, `${data.firstName} ${data.lastName}`, { comment }));

          return res.status(200).send({
            data: rows[0],
            message: 'Report flagged Successfully',
            error: false,
          });
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
