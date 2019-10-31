'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    const { DATE, STRING, TEXT, ENUM, BOOLEAN } = Sequelize;

    return queryInterface.createTable('Users', {
      id: {
        type: STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      type: {
        type: ENUM('trainer', 'partner', 'admin', 'super admin','googler', 'assessor', 'assessor manager'),
        allowNull: false,
      },
      expertiseLevel: {
        type: ENUM('beginner', 'intermediate', 'expert'),
        defaultValue: 'beginner',
      },
      adminId: {
        type: STRING,
      },
      organizationId: {
        type: STRING,
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
        unique: true,
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
        type: TEXT,
        allowNull: false,
      },
      profilePicture: {
        type: STRING,
        allowNull: true
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
    return Promise.all([
      queryInterface.dropTable('Users'),
      queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_type";'),
      queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_expertiseLevel";'),
      queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_sex";'),
    ]);
  }
};
