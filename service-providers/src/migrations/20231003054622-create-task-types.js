"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("providers_task_types", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      label: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "authenticator_users",
          key: "id",
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex(
      "providers_task_types",
      ["owner_id", "slug"], {
        concurrently: true,
        unique: true,
        type: "UNIQUE",
        name: "providers_task_types_owner_id_slug",
        where: {
          deleted_at: null
        },
      }
    );

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "providers_task_types",
      "providers_task_types_owner_id_slug"
    );
    await queryInterface.dropTable("providers_task_types");
  },
};