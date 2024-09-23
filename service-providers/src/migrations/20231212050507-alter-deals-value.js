"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("providers_deals", "value", {
      type: Sequelize.STRING(5),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("providers_deals", "value");
  },
};
