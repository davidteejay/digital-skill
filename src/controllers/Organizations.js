/* eslint-disable no-unused-vars */
/* eslint-disable radix */
/* eslint-disable consistent-return */
import db from '../models';
import { serverError } from '../helpers/errors';
import generateID from '../helpers/generateID';

const { Organizations } = db;

export default class OrganizationController {
  static async add(req, res) {
    try {
      const organizationId = await generateID(res, Organizations);

      await Organizations
        .create({
          ...req.body,
          id: organizationId,
        })
        .then((data) => res.status(200).send({
          data,
          message: 'Organization added successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;

      await Organizations
        .update({ ...req.body }, { returning: true, where: { id } })
        .then(([num, rows]) => res.status(200).send({
          data: rows[0],
          message: 'Organization updated Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async getAll(req, res) {
    try {
      await Organizations
        .findAll({
          where: { ...req.params, isDeleted: false },
        })
        .then(async (data) => res.status(200).send({
          data,
          message: 'Organizations Fetched Successfully',
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

      await Organizations
        .findByPk(id)
        .then((data) => res.status(200).send({
          data,
          message: 'Organizations fetched Successfully',
          error: false,
        }))
        .catch((err) => serverError(res, err.message));
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
