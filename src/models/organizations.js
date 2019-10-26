'use strict';
module.exports = (sequelize, DataTypes) => {
  const { DATE, STRING, BOOLEAN } = DataTypes;
  const Organizations = sequelize.define('Organizations', {
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
    shortName: {
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
  }, {});
  Organizations.associate = function(models) {
    // associations can be defined here
    Organizations.hasMany(models.Users, { as: 'users', foreignKey: 'organizationId' })
  };
  return Organizations;
};
