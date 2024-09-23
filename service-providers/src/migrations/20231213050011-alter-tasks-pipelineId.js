"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("providers_tasks", "pipeline_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "providers_pipelines",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("providers_tasks", "pipeline_id");
  },
};
