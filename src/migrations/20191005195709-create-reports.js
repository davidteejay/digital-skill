'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    const { DATE, TIME, STRING, BOOLEAN, ENUM, INTEGER } = Sequelize;

    return queryInterface.createTable('Reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER
      },
      trainerId: {
        type: STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      partnerId: {
        type: STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      sessionId: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'Sessions',
          key: 'id'
        }
      },
      quote: {
        type: STRING,
        allowNull: false,
      },
      // images: {
      //   type: STRING,
      // },
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
      totalNumber: {
        type: INTEGER,
        defaultValue: 0,
      },
      partnerStatus: {
        type: ENUM('pending', 'requested edit', 'approved', 'rejected'),
        defaultValue: 'pending',
      },
      adminStatus: {
        type: ENUM('pending', 'flagged', 'approved', 'rejected'),
        defaultValue: 'pending',
      },
      comment: {
        type: STRING,
      },
      startTime: {
        type: TIME,
        allowNull: false,
      },
      endTime: {
        type: TIME,
        allowNull: false,
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
