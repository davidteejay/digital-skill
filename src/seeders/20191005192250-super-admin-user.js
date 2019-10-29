'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id: '000001',
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
      id: '000002',
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
      id: '000003',
      type: 'partner',
      firstName: 'Chibuokem',
      lastName: 'Onyekwelu',
      email: 'partner1@gmail.com',
      password: '$2b$10$J9UdUqlh7IQjuTczQb4g8epedk9TL7/3j9uvxXgKb5JLzV.R08mEy',
      sex: 'male',
      phone: '07038125957',
      createdAt: new Date(),
      updatedAt: new Date(),
      adminId: '000002',
      organizationId: '000001'
    }, {
      id: '000004',
      type: 'trainer',
      firstName: 'Chibuokem',
      lastName: 'Onyekwelu',
      email: 'trainer1@gmail.com',
      password: '$2b$10$J9UdUqlh7IQjuTczQb4g8epedk9TL7/3j9uvxXgKb5JLzV.R08mEy',
      sex: 'male',
      phone: '07038125957',
      createdAt: new Date(),
      updatedAt: new Date(),
      adminId: '000002',
      partnerId: '000003',
      organizationId: '000001'
    }, {
      id: '000005',
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
      id: '000006',
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
