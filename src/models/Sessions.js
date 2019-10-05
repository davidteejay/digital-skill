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
    trainer: {
      type: STRING,
      allowNull: false,
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
      defaultValue: 'waiting',
    },
    clockStatus: {
      type: ENUM('clocked in', 'clocked out'),
      defaultValue: 'clocked out',
    },
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
    createdAt: DATE,
    updatedAt: DATE,
  }, {});
  Sessions.associate = function(models) {
    // associations can be defined here
  };
  return Sessions;
};
