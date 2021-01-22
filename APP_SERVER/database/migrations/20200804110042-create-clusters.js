'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Clusters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clusterId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      clusterName: {
        type: Sequelize.STRING
      },
      clusterPlace: {
        type: Sequelize.STRING
      },
      candidate: {
        type: Sequelize.STRING
      },
      // activityId: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      // },
      // createdAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE
      // },
      // updatedAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE
      // }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Clusters');
  }
};