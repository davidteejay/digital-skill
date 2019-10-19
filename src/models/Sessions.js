'use strict';
module.exports = (sequelize, DataTypes) => {
  const { DATE, STRING, ENUM, BOOLEAN, DATEONLY, TIME } = DataTypes;

  const Sessions = sequelize.define('Sessions', {
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
    partnerId: {
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
      // get: function(){
      //   return JSON.parse(this.getDataValue('location'))
      // },
      set: function (val) {
        return this.setDataValue('location', JSON.stringify(val))
      }
    },
    media: {
      type: STRING,
      set: function (val) {
        return this.setDataValue('media', JSON.stringify(val))
      }
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
    status: {
      type: ENUM('awaiting approval', 'approved', 'rejected', 'cancelled'),
      defaultValue: 'awaiting approval',
    },
    clockStatus: ENUM('clocked in', 'clocked out'),
    clockInTime: DATE,
    clockOutTime: DATE,
    hasReport: {
      type: BOOLEAN,
      defaultValue: false,
    },
    isDeleted: {
      type: BOOLEAN,
      defaultValue: false,
    },
    createdBy: {
      type: STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    createdAt: DATE,
    updatedAt: DATE,
  }, {});
  Sessions.associate = function(models) {
    // associations can be defined here
    Sessions.belongsTo(models.Users, { foreignKey: 'trainerId', as: 'trainer' })
    Sessions.belongsTo(models.Users, { foreignKey: 'partnerId', as: 'partner' })
    Sessions.belongsTo(models.Users, { foreignKey: 'createdBy', as: 'sessionCreatedBy' })
    Sessions.belongsTo(models.Users, { foreignKey: 'assessorId', as: 'assessor' })

    Sessions.hasMany(models.Reports, { foreignKey: 'sessionId', as: 'reports' })
  };
  return Sessions;
};
