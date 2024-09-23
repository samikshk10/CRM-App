"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("providers_tasks", "attachment_ids", {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("providers_tasks", "attachment_ids");
  },
}