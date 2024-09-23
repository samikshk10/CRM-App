"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("providers_tasks", "starred", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull:false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("providers_tasks", "starred");
  },
}