'use strict';

const fs = require('fs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const data = fs.readFileSync('/home/tvluon/Documents/FlutterProjects/app_server/raw_data/clusters.json', 'utf-8');
    const list_clusters = JSON.parse(data);
    await queryInterface.bulkInsert('Clusters', list_clusters, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
