import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { serverError } from './errors';

dotenv.config();
const { SECRET } = process.env;

const generateToken = async (res, user) => {
  try {
    const token = await jwt.sign({ user }, SECRET, {
      expiresIn: '2w',
    });

    return token;
  } catch (err) {
    return serverError(res, err.message);
  }
};

export default generateToken;
