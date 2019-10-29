'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      type: 'super admin',
      firstName: 'Chibuokem',
      lastName: 'Onyekwelu',
      email: 'chibuokem_tolu@hotmail.com',
      password: '$2b$10$J9UdUqlh7IQjuTczQb4g8epedk9TL7/3j9uvxXgKb5JLzV.R08mEy',
      sex: 'male',
      phone: '07038125957',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      type: 'admin',
      firstName: 'Chibuokem',
      lastName: 'Onyekwelu',
      email: 'admin1@gmail.com',
      password: '$2b$10$J9UdUqlh7IQjuTczQb4g8epedk9TL7/3j9uvxXgKb5JLzV.R08mEy',
      sex: 'male',
      phone: '07038125957',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      type: 'partner',
      firstName: 'Chibuokem',
      lastName: 'Onyekwelu',
      email: 'partner1@gmail.com',
      password: '$2b$10$J9UdUqlh7IQjuTczQb4g8epedk9TL7/3j9uvxXgKb5JLzV.R08mEy',
      sex: 'male',
      phone: '07038125957',
      createdAt: new Date(),
      updatedAt: new Date(),
      adminId: 2,
      organizationId: 1
    }, {
      type: 'trainer',
      firstName: 'Chibuokem',
      lastName: 'Onyekwelu',
      email: 'trainer1@gmail.com',
      password: '$2b$10$J9UdUqlh7IQjuTczQb4g8epedk9TL7/3j9uvxXgKb5JLzV.R08mEy',
      sex: 'male',
      phone: '07038125957',
      createdAt: new Date(),
      updatedAt: new Date(),
      adminId: 2,
      partnerId: 3,
      organizationId: 1
    }, {
      type: 'assessor',
      firstName: 'Chibuokem',
      lastName: 'Onyekwelu',
      email: 'assessor1@gmail.com',
      password: '$2b$10$J9UdUqlh7IQjuTczQb4g8epedk9TL7/3j9uvxXgKb5JLzV.R08mEy',
      sex: 'male',
      phone: '07038125957',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      type: 'assessor manager',
      firstName: 'Chibuokem',
      lastName: 'Onyekwelu',
      email: 'chibuokem2007@gmail.com',
      password: '$2b$10$J9UdUqlh7IQjuTczQb4g8epedk9TL7/3j9uvxXgKb5JLzV.R08mEy',
      sex: 'male',
      phone: '07038125957',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
