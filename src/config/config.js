require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres"
  },
  production: {
    username: "admin",
    password: "admin",
    database: "digital_skills",
    host: "localhost",
    dialect: "postgres",
    dialectOptions: {
      socketPath: "/cloudsql/digitalskillshub:us-central1:digital-skills",
    },
    logging: false
  }
};
