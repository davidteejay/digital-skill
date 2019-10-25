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
    sessionId: DataTypes.STRING,
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
  };
  return Notifications;
};
