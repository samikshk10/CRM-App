"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "providers_milestones",
      "providers_milestones_owner_id_slug"
    );

    await queryInterface.addIndex(
      "providers_milestones",
      ["owner_id", "pipeline_id", "slug"],
      {
        concurrently: true,
        unique: true,
        type: "UNIQUE",
        name: "providers_milestones_owner_id_pipeline_id_slug",
        where: {
          deleted_at: null,
        },
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "providers_milestones",
      "providers_milestones_owner_id_pipeline_id_slug"
    );

    await queryInterface.addIndex(
      "providers_milestones",
      ["owner_id", "slug"], {
        concurrently: true,
        unique: true,
        type: "UNIQUE",
        name: "providers_milestones_owner_id_slug",
        where: {
          deleted_at: null,
        },
      }
    );
  },
};
