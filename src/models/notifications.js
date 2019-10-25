'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notifications = sequelize.define('Notifications', {
    ids: {
      type: DataTypes.STRING,
      // get: function(){
      //   return this.getDataValue('ids').split(',')
      // }
    },
    title: DataTypes.STRING,
    message: DataTypes.STRING,
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    performedBy: {
      type: DataTypes.String,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {});
  Notifications.associate = function(models) {
    // associations can be defined here
    Notifications.hasOne(models.Users, { foreignKey: 'performedBy', as: 'by' })
  };
  return Notifications;
};
