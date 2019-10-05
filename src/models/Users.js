'use strict';
module.exports = (sequelize, DataTypes) => {
  const { DATE, STRING, ENUM, BOOLEAN } = DataTypes;

  const Users = sequelize.define('Users', {
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
      references: {
        model: 'Users',
        key: 'id'
      },
    },
    admin: {
      type: STRING,
      references: {
        model: 'Users',
        key: 'id'
      },
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
    createdAt: DATE,
    updatedAt: DATE,
  }, {});
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};
