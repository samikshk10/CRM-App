"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("providers_tasks", "tag_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "providers_tags",
        key: "id",
      },
    
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("providers_tasks", "tag_id");
  },
}