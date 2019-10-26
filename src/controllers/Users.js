/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
import db from '../models';
import generateToken from '../helpers/generateToken';
import generateID from '../helpers/generateID';
import {
  serverError, notFoundError, incompleteDataError, accessDenied,
} from '../helpers/errors';
import sendMail from '../helpers/sendMail';

const { Users, Sessions, Reports } = db;

export default class UserController {
  static async refreshToken(req, res) {
    try {
      const { auth } = req.data;

      const token = await generateToken(res, auth);
      return res.status(200).send({
        data: { token },
        message: 'Token refreshed Successful',
        error: false,
      });
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async addUser(req, res) {
    try {
      const { auth: { type, id } } = req.data;
      const { email, firstName, password } = req.body;
      const userId = await generateID(res, Users);
      const userType = req.body.type;
      const partnerID = req.body.partnerId;

      if ((type === 'admin' || type === 'super admin') && userType === 'trainer' && !partnerID) return incompleteDataError(res, 'partnerId is required');
      // if (type === 'admin' && (userType === 'admin' || userType === 'super admin')) return incompleteDataError(res, 'You can only add a partner or a trainer');
      if (type === 'assessor manager' && userType !== 'assessor') return incompleteDataError(res, 'You can only add an assessor');

      let partnerId = '';
      let adminId = null;
      if (type === 'admin' || type === 'super admin') {
        partnerId = req.body.partnerId;
        adminId = id;
      } else partnerId = id;

      await Users
        .create({
          ...req.body,
          id: userId,
          partnerId,
          adminId,
          isApproved: !(type === 'partner' && userType === 'trainer'),
        })
        .then(async (data) => {
          await sendMail('newUser', email, firstName, { password });
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
          }, {
            model: db.Organizations,
            as: 'organization',
          }],
        })
        .then(async (data) => {
          if (data === null) return notFoundError(res, 'Email or Password is incorrect');
          if (!data.isApproved) return accessDenied(res, 'Your account has been suspended');

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

  static async getDashboardData(req, res) {
    try {
      const { auth: { id, type } } = req.data;

      let params = {};
      if (type === 'partner') params = { partnerId: id };
      if (type === 'trainer') params = { trainerId: id };

      await Sessions
        .findAll({
          where: {
            ...params,
            accepted: true,
            status: 'approved',
            hasReport: true,
          },
          include: [{
            model: Reports,
            as: 'report',
          }],
        })
        .then(async (data) => {
          let numberOfMale = 0;
          let numberOfFemale = 0;
          let numberOfGMB = 0;
          let totalNumber = 0;
          let numberOfSMB = 0;
          let numberOfJobSeekers = 0;

          await data.forEach((session) => {
            if (session.report && session.report.adminStatus === 'approved') {
              numberOfFemale += session.report.numberOfFemale;
              numberOfMale += session.report.numberOfMale;
              numberOfGMB += session.report.numberOfGMB;
              totalNumber += session.report.totalNumber;

              if (session.materials === 'SMB') numberOfSMB += session.report.totalNumber;
              if (session.materials === 'Job Seeker') numberOfJobSeekers += session.report.totalNumber;
            }
          });

          return res.status(200).send({
            data: {
              numberOfFemale,
              numberOfGMB,
              numberOfMale,
              totalNumber,
              numberOfSMB,
              numberOfJobSeekers,
            },
            message: 'Dashboard Data fetched',
            error: false,
          });
        })
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async getAll(req, res) {
    try {
      const { auth: { type, id } } = req.data;

      let params = {};

      if (type === 'partner') params = { partnerId: id };
      if (type === 'assessor manager') params = { type: 'assessor' };

      await Users
        .findAll({
          where: { ...req.query, ...params, isDeleted: false },
          include: [{
            model: db.Users,
            as: 'admin',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }, {
            model: db.Users,
            as: 'partner',
            attributes: ['id', 'email', 'firstName', 'lastName'],
          }, {
            model: db.Organizations,
            as: 'organization',
          }],
        })
        .then((data) => res.status(200).send({
          data,
          message: 'Users fetched Successfully',
          error: false,
        }))
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
          }, {
            model: db.Organizations,
            as: 'organization',
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

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      await Users
        .update({ isDeleted: true }, { where: { id } })
        .then(([num, rows]) => res.status(200).send({
          data: null,
          message: 'User deleted Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async approveUser(req, res) {
    try {
      const { id } = req.params;

      await Users
        .update({ isApproved: true }, { returning: true, where: { id } })
        .then(([num, rows]) => res.status(200).send({
          data: rows[0],
          message: 'User approved Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async resetPassword(req, res) {
    try {
      const { auth: { id, password } } = req.data;
      const { oldPassword, newPassword } = req.body;

      if (oldPassword !== password) return accessDenied(res, 'Incorrect Password');

      await Users
        .update({ password: newPassword }, { returning: true, where: { id } })
        .then(([num, rows]) => res.status(200).send({
          data: rows[0],
          message: 'Password Reset Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
