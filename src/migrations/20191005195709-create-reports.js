'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    const { DATE, STRING, BOOLEAN, ARRAY, INTEGER } = Sequelize;

    return queryInterface.createTable('Reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER
      },
      id: {
        type: STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      trainerId: {
        type: STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      sessionId: {
        type: STRING,
        allowNull: false,
        references: {
          model: 'Sessions',
          key: 'id'
        }
      },
      images: {
        type: STRING,
      },
      numberOfMale: {
        type: INTEGER,
        defaultValue: 0,
      },
      numberOfFemale: {
        type: INTEGER,
        defaultValue: 0,
      },
      numberOfGMB: {
        type: INTEGER,
        defaultValue: 0,
      },
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
    return queryInterface.dropTable('Reports');
  }
};
