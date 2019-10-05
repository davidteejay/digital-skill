'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id: '000001',
      type: 'super admin',
      firstName: 'Chibuokem',
      lastName: 'Onyekwelu',
      email: 'chibuokem_tolu@hotmail.com',
      password: '00000000',
      sex: 'male',
      phone: '07038125957',
      createdAt: new Date(),
      updatedAt: new Date()
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
