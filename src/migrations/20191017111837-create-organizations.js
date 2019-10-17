'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    const { DATE, STRING, BOOLEAN } = Sequelize;

    return queryInterface.createTable('Organizations', {
      id: {
        type: STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      name: {
        type: STRING,
        allowNull: false,
      },
      email: {
        type: STRING,
        allowNull: false,
      },
      country: {
        type: STRING,
        allowNull: false,
      },
      website: {
        type: STRING,
        allowNull: false,
      },
      logo: STRING,
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
    return queryInterface.dropTable('Organizations');
  }
};
