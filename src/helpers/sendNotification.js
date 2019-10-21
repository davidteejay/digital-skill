/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import FCM from 'fcm-node';
import dotenv from 'dotenv';

import { serverError } from './errors';
import db from '../models';

const { Users, Notifications } = db;

const sendNotification = async (res, ids, title, message) => {
  try {
    dotenv.config();

    const { FCM_SERVER_KEY } = process.env;
    const fcm = new FCM(FCM_SERVER_KEY);

    await Notifications
      .create({
        ids: ids.join(','),
        title,
        message,
      })
      .catch((err) => serverError(res, err.message));

    const registration_ids = [];

    await ids.forEach((id) => {
      Users
        .findByPk(id)
        .then((user) => {
          const { fcmToken } = user;
          if (fcmToken) registration_ids.push(fcmToken);
        })
        .catch((err) => serverError(res, err.message));
    });

    const notification = {
      registration_ids,
      notification: {
        title,
        message,
      },
    };

    fcm.send(notification, (err, response) => {
      if (err) return serverError(res, err);
    });
  } catch (err) {
    return serverError(res, err.message);
  }
};

export default sendNotification;