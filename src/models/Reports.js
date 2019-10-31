'use strict';
module.exports = (sequelize, DataTypes) => {
  const { DATE, TIME, STRING, BOOLEAN, INTEGER, ENUM } = DataTypes;

  const Reports = sequelize.define('Reports', {
    id: {
      type: INTEGER,
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
    organizationId: {
      type: STRING,
      allowNull: false,
      references: {
        model: 'Organizations',
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
    createdAt: DATE,
    updatedAt: DATE,
  }, {});
  Reports.associate = function(models) {
    // associations can be defined here
    Reports.belongsTo(models.Users, { foreignKey: 'trainerId', as: 'trainer' })
    Reports.belongsTo(models.Organizations, { foreignKey: 'organizationId', as: 'organization' })
    Reports.belongsTo(models.Sessions, { foreignKey: 'sessionId', as: 'session' })
  };
  return Reports;
};
