/* eslint-disable consistent-return */
import Reports from '../models/Reports';
import { serverError } from '../helpers/errors';
import generateID from '../helpers/generateID';

export default class ReportController {
  static async addReport(req, res) {
    try {
      const { auth: { _id }, images } = req.data;
      const id = await generateID(res, Reports);

      const allImages = await images.map((image) => image.secure_url);

      await new Reports({
        ...req.body, id, trainer: _id, images: allImages,
      })
        .save()
        .then((data) => res.status(200).send({
          data,
          message: 'Report sent successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
