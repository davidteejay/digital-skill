'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    const { DATE, STRING, ENUM, BOOLEAN } = Sequelize;

    return queryInterface.createTable('Users', {
      id: {
        type: STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      type: {
        type: ENUM('trainer', 'partner', 'admin', 'super admin'),
        allowNull: false,
      },
      partner: {
        type: STRING,
      },
      admin: {
        type: STRING,
      },
      firstName: {
        type: STRING,
        allowNull: false,
      },
      lastName: {
        type: STRING,
        allowNull: false,
      },
      email: {
        type: STRING,
        allowNull: false,
      },
      password: {
        type: STRING,
        allowNull: false,
      },
      sex: {
        type: ENUM('male', 'female'),
        allowNull: false,
      },
      phone: {
        type: STRING,
        allowNull: false,
      },
      language: {
        type: STRING,
        defaultValue: 'english',
      },
      country: STRING,
      state: STRING,
      community: STRING,
      isDeleted: {
        type: BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: DATE
      },
      updatedAt: {
        allowNull: false,
        type: DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
