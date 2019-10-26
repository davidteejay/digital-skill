'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Organizations', [{
      id: '000001',
      name: 'Pseudo Company',
      shortName: 'Pseudo',
      email: 'company1@gmail.com',
      country: 'Nigeria',
      website: 'www.pseudo.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    }])
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
