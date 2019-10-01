/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { serverError, accessDenied, incompleteDataError } from '../helpers/errors';

dotenv.config();
const { SECRET } = process.env;

export default class AuthMiddleware {
  static async validateToken(req, res, next) {
    try {
      const { token } = req.headers;

      if (token) {
        await jwt.verify(token, SECRET, (err, decoded) => {
          if (err || !decoded) {
            if (err.name === 'TokenExpiredError') return accessDenied(res, 'Session expired. Please login again to create a new session');
            return accessDenied(res, 'Invalid Token');
          }

          const { user } = decoded;

          req.data = {
            ...req.data,
            auth: user,
          };

          return next();
        });
      } else return accessDenied(res, 'Invalid Token');
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async checkIfIdIsValid(req, res, next) {
    try {
      const { Types: { ObjectId } } = mongoose;
      const { id } = req.params;

      const validateId = ObjectId.isValid(id) && new ObjectId(id) == id;

      if (validateId) return next();

      return incompleteDataError(res, 'Invalid ID');
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
