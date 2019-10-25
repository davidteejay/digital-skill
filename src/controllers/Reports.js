/* eslint-disable no-unused-vars */
/* eslint-disable radix */
/* eslint-disable consistent-return */
import db from '../models';
import { serverError, incompleteDataError } from '../helpers/errors';
import generateID from '../helpers/generateID';
import sendNotification from '../helpers/sendNotification';

const { Reports } = db;

export default class ReportController {
  static async addReport(req, res) {
    try {
      const { auth: { id, partnerId, adminId }, images } = req.data;
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
          partnerId,
          images,
        })
        .then(async (data) => {
          await sendNotification(res, [partnerId, adminId], 'New Report', `A new report has been sent for Session ${sessionId}`, sessionId);
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
      const { auth: { adminId, partnerId } } = req.data;

      await Reports
        .update({ ...req.body }, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, [partnerId, adminId], 'Report Updated', `Report ${id} for Session ${rows[0].sessionId} has been updated`, rows[0].sessionId);
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
      const { auth: { type, partnerId, adminId }, report: { sessionId, trainerId } } = req.data;

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
        ids = [partnerId, trainerId];
      }

      await Reports
        .update(update, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, ids, 'Report Approved', message, sessionId);
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
      const { auth: { type, partnerId, adminId }, report: { sessionId, trainerId } } = req.data;
      const { comment } = req.body;

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
        ids = [partnerId, trainerId];
      }

      await Reports
        .update(update, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, ids, 'Report Rejected', message, sessionId);
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
      const { auth: { adminId }, report: { sessionId, trainerId } } = req.data;
      const { comment } = req.body;

      await Reports
        .update({ partnerStatus: 'requested edit', comment }, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, [adminId, trainerId], 'Edit Requested', `The partner requested edit for Report ${id} in Session ${sessionId}`, sessionId);
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
      const { auth: { partnerId }, report: { sessionId, trainerId } } = req.data;
      const { comment } = req.body;

      await Reports
        .update({ adminStatus: 'flagged', comment }, { returning: true, where: { id } })
        .then(async ([num, rows]) => {
          await sendNotification(res, [partnerId, trainerId], 'Report flagged', `The admin flagged Report ${id} in Session ${sessionId}`, sessionId);
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
