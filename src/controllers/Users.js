/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
import crypto from 'crypto';

import Users from '../models/Users';
import generateToken from '../helpers/generateToken';
import generateID from '../helpers/generateID';
import { serverError, notFoundError, incompleteDataError } from '../helpers/errors';

export default class UserController {
  static async addUser(req, res) {
    try {
      const { hash, salt, auth: { type, _id } } = req.data;
      const id = await generateID(res, Users);
      const userType = req.body.type;
      const partnerID = req.body.partner;

      if (type === 'admin' && userType === 'trainer' && !partnerID) return incompleteDataError(res, 'partner is required');

      let partner = '';
      let admin = null;
      if (type === 'admin') {
        partner = req.body.partner;
        admin = _id;
      } else partner = _id;

      await new Users({
        ...req.body, hash, salt, id, partner, admin,
      })
        .save()
        .then(async (data) => {
          const token = await generateToken(res, data);
          return res.status(200).send({
            data: { ...data._doc, token },
            message: 'Signup Successful',
            error: false,
          });
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      await Users.findOne({ email, isDeleted: false })
        .populate('admin')
        .populate('partner')
        .then(async (data) => {
          if (data === null) return notFoundError(res, 'Email or Password is incorrect');

          const hash = crypto.pbkdf2Sync(password, data.salt, 10000, 512, 'sha512').toString('hex');

          if (hash !== data.hash) return notFoundError(res, 'Email or Password is incorrect');

          const token = await generateToken(res, data);
          return res.status(200).send({
            data: { ...data._doc, token },
            message: 'Login Successful',
            error: false,
          });
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
