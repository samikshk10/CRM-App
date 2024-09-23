"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("providers_pipelines", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      parent_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "providers_pipelines",
          key: "id",
        },
      },
      level: {
        type: Sequelize.INTEGER,
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

    await queryInterface.addIndex("providers_pipelines", ["owner_id", "slug"], {
      concurrently: true,
      unique: true,
      type: "UNIQUE",
      name: "providers_pipelines_owner_id_slug",
      where: {
        deleted_at: null
      },
    });

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeIndex(
      "providers_pipelines",
      "providers_pipelines_owner_id_slug"
    );
    await queryInterface.dropTable("providers_pipelines", );

  },
};