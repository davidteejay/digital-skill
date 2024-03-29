/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import '@babel/polyfill';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import Debug from 'debug';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cloudinary from 'cloudinary';
import formData from 'express-form-data';
import Sequelize from 'sequelize';

import routes from './routes';

const path = require('path');

// Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

// .env configuration with dotenv
dotenv.config();
const {
  NODE_ENV, DB_DEV, DB_PROD, PORT, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// Setup debug
const debug = Debug('app:server');

// Configure isProduction variable
const isProduction = NODE_ENV === 'production';

// Initiate our app
const app = express();

// Configure our app
app.use(cors());
app.use(formData.parse());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (!isProduction) {
  app.use(morgan('dev'));
}

// Configure Mongoose
// mongoose
//   .connect(isProduction ? DB_PROD : DB_DEV, {
//     useNewUrlParser: true,
//   })
//   .then(() => debug('DB Connected'))
//   .catch((err) => {
//     debug(err);
//     debug('DB Connection Failed');
//   });

// mongoose.set('debug', true);

// Routes
app.use('/api/v1/', routes);
app.use('/*', (req, res) => res.status(404).send({
  data: null,
  message: 'Incorrect Route',
  error: true,
}));

app.use((err, req, res, next) => {
  debug(err.stack);
  return res.status(500).send({
    data: null,
    message: err.message,
    error: true,
  });
});

const port = PORT || 8080;
app.listen(port, () => debug(`Server running on port ${port}`));
