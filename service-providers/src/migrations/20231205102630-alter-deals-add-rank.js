"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("providers_deals", "rank", {
      type: Sequelize.DECIMAL(10,8)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("providers_deals", "rank");
  },
}