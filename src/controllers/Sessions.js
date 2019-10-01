/* eslint-disable consistent-return */
import Sessions from '../models/Sessions';
import { serverError } from '../helpers/errors';
import generateID from '../helpers/generateID';

export default class SessionController {
  static async getAll(req, res) {
    try {
      await Sessions
        .find({ ...req.params, isDeleted: false })
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
      const { auth: { _id } } = req.data;
      const id = await generateID(res, Sessions);

      await new Sessions({ ...req.body, createdBy: _id, id })
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
}
