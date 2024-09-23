"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("providers_milestones", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      pipeline_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "providers_pipelines",
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "authenticator_users",
          key: "id",
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });

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

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "providers_milestones",
      "providers_milestones_owner_id_slug"
    );
    await queryInterface.dropTable("providers_milestones");
  }
};