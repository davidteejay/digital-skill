/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import FCM from 'fcm-node';
import dotenv from 'dotenv';

import db from '../models';

const { Users, Notifications } = db;

const sendNotification = async (res, ids, title, message, sessionId, performedBy, organizationId) => {
  try {
    dotenv.config();

    const { FCM_SERVER_KEY } = process.env;
    const fcm = new FCM(FCM_SERVER_KEY);
    const userData = [];

    // get all partners in an organization
    await Users
      .findAll({ where: { type: 'partner', organizationId } })
      .then((data) => {
        data.forEach((user) => {
          ids.push(user.id);
          userData.push(user);
        });
      })
      .catch((err) => console.error(`fetch partners: ${err.message}`));

    // add notification to database
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

    // get fcmToken of users
    await ids.forEach(async (id) => {
      // check if we already have the user data
      const isFetched = await userData.find((user) => user.id === id);

      // push fcmToken to registration ids array if we do
      if (isFetched) {
        const { fcmToken } = isFetched;
        if (fcmToken) registration_ids.push(fcmToken);
      } else {
        // if not, get the fcmToken
        await Users
          .findByPk(id)
          .then((user) => {
            const { fcmToken } = user;
            if (fcmToken) registration_ids.push(fcmToken);
          })
          .catch((err) => console.error(`fetch token: ${err.message}`));
      }
    });

    const notification = {
      registration_ids,
      notification: {
        title,
        message,
      },
    };

    // send push notification
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
