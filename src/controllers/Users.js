/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
import db from '../models';
import generateToken from '../helpers/generateToken';
import generateID from '../helpers/generateID';
import { serverError, notFoundError, incompleteDataError } from '../helpers/errors';

const { Users } = db;

export default class UserController {
  static async addUser(req, res) {
    try {
      const { hash, salt, auth: { type, id } } = req.data;
      const userId = await generateID(res, Users);
      const userType = req.body.type;
      const partnerID = req.body.partner;

      if ((type === 'admin' || type === 'super admin') && userType === 'trainer' && !partnerID) return incompleteDataError(res, 'partner is required');

      let partner = '';
      let admin = null;
      if (type === 'admin' || type === 'super admin') {
        partner = req.body.partner;
        admin = id;
      } else partner = id;

      await Users
        .create({
          ...req.body, hash, salt, id: userId, partner, admin,
        })
        .then(async (data) => {
          const token = await generateToken(res, data.toJSON());
          return res.status(200).send({
            data: { ...data.toJSON(), token },
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

      await Users
        .findOne({ where: { email, password, isDeleted: false } })
        .then(async (data) => {
          if (data === null) return notFoundError(res, 'Email or Password is incorrect');

          const token = await generateToken(res, data.toJSON());
          return res.status(200).send({
            data: { ...data.toJSON(), token },
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
