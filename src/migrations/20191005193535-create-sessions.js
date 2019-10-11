'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    const { DATE, STRING, ENUM, BOOLEAN, DATEONLY, TIME } = Sequelize;

    return queryInterface.createTable('Sessions', {
      id: {
        type: STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      type: {
        type: STRING,
        allowNull: false,
      },
      materials: {
        type: STRING,
        allowNull: false,
      },
      date: {
        type: DATEONLY,
        allowNull: false,
      },
      time: {
        type: TIME,
        allowNull: false,
      },
      trainerId: {
        type: STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      assessorId: {
        type: STRING,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      language: {
        type: STRING,
        defaultValue: 'english',
      },
      country: {
        type: STRING,
        allowNull: false,
      },
      state: {
        type: STRING,
        allowNull: false,
      },
      community: {
        type: STRING,
      },
      expectedNumber: {
        type: STRING,
        allowNull: false,
      },
      address: {
        type: STRING,
        allowNull: false,
      },
      location: {
        type: STRING,
        allowNull: false,
      },
      audienceSelection: {
        type: STRING,
        allowNull: false,
      },
      audienceDescription: {
        type: STRING,
        allowNull: false,
      },
      audienceExpertLevel: {
        type: STRING,
        allowNull: false,
      },
      natureOfTraining: {
        type: STRING,
        allowNull: false,
      },
      photoWorthy: {
        type: BOOLEAN,
        defaultValue: false,
      },
      accepted: {
        type: BOOLEAN,
        defaultValue: false,
      },
      trainerStatus: {
        type: ENUM('no_action', 'waiting', 'done', 'failed'),
        defaultValue: 'waiting',
      },
      adminStatus: {
        type: ENUM('no_action', 'waiting', 'done', 'failed'),
        defaultValue: 'no_action',
      },
      partnerStatus: {
        type: ENUM('no_action', 'waiting', 'done', 'failed'),
        defaultValue: 'no_action',
      },
      clockStatus: ENUM('clocked in', 'clocked out'),
      clockInTime: {
        type: DATE,
      },
      clockOutTime: {
        type: DATE,
      },
      isDeleted: {
        type: BOOLEAN,
        defaultValue: false,
      },
      createdBy: {
        type: STRING,
        references: {
          model: 'Users',
          key: 'id'
        }
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
    return queryInterface.dropTable('Sessions');
  }
};
