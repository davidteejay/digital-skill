'use strict';
module.exports = (sequelize, DataTypes) => {
  const { DATE, TEXT, STRING, ENUM, BOOLEAN } = DataTypes;

  const Users = sequelize.define('Users', {
    id: {
      type: STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    type: {
      type: ENUM('trainer', 'partner', 'admin', 'super admin','googler','assessor', 'assessor manager'),
      allowNull: false,
    },
    expertiseLevel: ENUM('beginner', 'intermediate', 'expert'),
    adminId: {
      type: STRING,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    organizationId: {
      type: STRING,
      references: {
        model: 'Organizations',
        key: 'id'
      }
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
    profilePicture: {
      type: TEXT,
      allowNull: true,
    },
    language: {
      type: STRING,
      defaultValue: 'english',
    },
    country: STRING,
    state: STRING,
    community: STRING,
    fcmToken: STRING,
    isApproved: {
      type: BOOLEAN,
      defaultValue: true,
    },
    isDeleted: {
      type: BOOLEAN,
      defaultValue: false,
    },
    createdAt: DATE,
    updatedAt: DATE,
  }, {});
  Users.associate = function(models) {
    // associations can be defined here
    Users.belongsTo(models.Users, { foreignKey: 'adminId', as: 'admin' })
    Users.hasOne(models.Users, { foreignKey: 'adminId', as: 'adminData' })
    Users.belongsTo(models.Organizations, { foreignKey: 'organizationId', as: 'organization' })
  };
  return Users;
};
