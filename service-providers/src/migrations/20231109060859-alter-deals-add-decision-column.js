"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("providers_deals", "decision", {
      type: Sequelize.JSONB,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("providers_deals", "decision");
  },
};