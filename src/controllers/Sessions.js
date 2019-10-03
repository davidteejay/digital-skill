/* eslint-disable consistent-return */
import Sessions from '../models/Sessions';
import { serverError } from '../helpers/errors';
import generateID from '../helpers/generateID';

export default class SessionController {
  static async getAll(req, res) {
    try {
      await Sessions
        .find({ ...req.params, isDeleted: false })
        .populate('trainer', 'firstName lastName email')
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
      const { auth: { type, _id } } = req.data;
      const id = await generateID(res, Sessions);

      await new Sessions({
        ...req.body,
        trainer: type === 'trainer' ? _id : req.body.trainer,
        createdBy: _id,
        id,
      })
        .save()
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
      const { auth: { _id } } = req.data;
      const { id } = req.params;

      await Sessions
        .findOneAndUpdate({ id }, { approvedBy: _id, status: 'approved' }, { new: true })
        .then((data) => res.status(200).send({
          data,
          message: 'Session Approved Successfully',
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
        .findOneAndUpdate({ id }, { clockInTime: new Date(), clockStatus: 'clocked in' }, { new: true })
        .then((data) => res.status(200).send({
          data,
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
        .findOneAndUpdate({ id }, { clockOutTime: new Date(), clockStatus: 'clocked out' }, { new: true })
        .then((data) => res.status(200).send({
          data,
          message: 'Session Clocked out Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
