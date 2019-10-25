/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import FCM from 'fcm-node';
import dotenv from 'dotenv';

import db from '../models';

const { Users, Notifications } = db;

const sendNotification = async (res, ids, title, message, sessionId, performedBy) => {
  try {
    dotenv.config();

    const { FCM_SERVER_KEY } = process.env;
    const fcm = new FCM(FCM_SERVER_KEY);

    await Notifications
      .create({
        ids: ids.join(','),
        title,
        message,
        sessionId,
        performedBy,
      })
      .catch((err) => console.error(`create notif: ${err.message}`));

    const registration_ids = [];

    await ids.forEach((id) => {
      Users
        .findByPk(id)
        .then((user) => {
          const { fcmToken } = user;
          if (fcmToken) registration_ids.push(fcmToken);
        })
        .catch((err) => console.error(`fetch token: ${err.message}`));
    });

    const notification = {
      registration_ids,
      notification: {
        title,
        message,
      },
    };

    if (registration_ids.length > 0) {
      fcm.send(notification, (err, response) => {
        if (err) return console.error(`send notif: ${err}`);
      });
    }
  } catch (err) {
    return console.error(`else: ${err.message}`);
  }
};

export default sendNotification;
