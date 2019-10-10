/* eslint-disable no-unused-vars */
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
      const partnerID = req.body.partnerId;

      if ((type === 'admin' || type === 'super admin') && userType === 'trainer' && !partnerID) return incompleteDataError(res, 'partner is required');

      let partnerId = '';
      let adminId = null;
      if (type === 'admin' || type === 'super admin') {
        partnerId = req.body.partnerId;
        adminId = id;
      } else partnerId = id;

      await Users
        .create({
          ...req.body, hash, salt, id: userId, partnerId, adminId,
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
        .findOne({
          where: { email, password, isDeleted: false },
          include: [{
            model: db.Users,
            as: 'admin',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }, {
            model: db.Users,
            as: 'partner',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }],
        })
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

  static async getOne(req, res) {
    try {
      const { id } = req.params;

      await Users
        .findOne({
          where: { id, isDeleted: false },
          include: [{
            model: db.Users,
            as: 'admin',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }, {
            model: db.Users,
            as: 'partner',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }],
        })
        .then((data) => res.status(200).send({
          data,
          message: 'User fetched Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;

      await Users
        .update({ ...req.body }, { returning: true, where: { id } })
        .then(([num, rows]) => res.status(200).send({
          data: rows[0],
          message: 'User updated Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
