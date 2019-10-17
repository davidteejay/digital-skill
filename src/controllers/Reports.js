/* eslint-disable no-unused-vars */
/* eslint-disable radix */
/* eslint-disable consistent-return */
import db from '../models';
import { serverError, incompleteDataError } from '../helpers/errors';
import generateID from '../helpers/generateID';

const { Reports } = db;

export default class ReportController {
  static async addReport(req, res) {
    try {
      const { auth: { id }, images } = req.data;
      const reportId = await generateID(res, Reports);

      const {
        numberOfMale, numberOfFemale, totalNumber,
      } = req.body;

      if (parseInt(totalNumber) !== parseInt(numberOfFemale) + parseInt(numberOfMale)) return incompleteDataError(res, 'total number must be the sum of total male and total female');

      await Reports
        .create({
          ...req.body,
          id: reportId,
          trainerId: id,
          images,
        })
        .then((data) => res.status(200).send({
          data: {
            ...data.toJSON(),
            images,
          },
          message: 'Report sent successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async updateReport(req, res) {
    try {
      const { id } = req.params;

      await Reports
        .update({ ...req.body }, { returning: true, where: { id } })
        .then(([num, rows]) => res.status(200).send({
          data: rows[0],
          message: 'Report updated Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
