'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('providers_tasks', 'created_by_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'authenticator_users',
        key: 'id',
      },
    });

    await queryInterface.addColumn('providers_tasks', 'updated_by_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'authenticator_users',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('providers_tasks', 'updated_by_id');
    await queryInterface.removeColumn('providers_tasks', 'created_by_id');
  }
};