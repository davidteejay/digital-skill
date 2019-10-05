'use strict';
module.exports = (sequelize, DataTypes) => {
  const { DATE, STRING, BOOLEAN, INTEGER } = DataTypes;

  const Reports = sequelize.define('Reports', {
    id: {
      type: STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    trainer: {
      type: STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    session: {
      type: STRING,
      allowNull: false,
      references: {
        model: 'Sessions',
        key: 'id'
      }
    },
    images: {
      type: STRING,
      allowNull: false,
      // get: function () {
      //   return JSON.parse(this.getDataValue('images'))
      // },
      set: function (val) {
        return this.setDataValue('images', JSON.stringify(val))
      }
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
    createdAt: DATE,
    updatedAt: DATE,
  }, {});
  Reports.associate = function(models) {
    // associations can be defined here
  };
  return Reports;
};
