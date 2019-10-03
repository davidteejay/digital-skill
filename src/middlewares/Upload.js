/* eslint-disable consistent-return */
import cloudinary from 'cloudinary';
import debug from 'debug';

import { serverError } from '../helpers/errors';

export default class UploadMiddleware {
  static async uploadFiles(req, res, next) {
    try {
      const values = Object.values(req.files);
      const promises = values[0].map((image) => cloudinary.uploader.upload(image.path));

      Promise
        .all(promises)
        .then((images) => {
          debug('app:upload')(images);
          req.data = {
            ...req.data,
            images,
          };

          return next();
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
