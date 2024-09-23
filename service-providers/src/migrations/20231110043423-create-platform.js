"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("providers_platforms", {
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
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      avatar_url: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.addIndex("providers_platforms", ["slug"], {
      concurrently: true,
      unique: true,
      type: "UNIQUE",
      name: "providers_platforms_slug",
      where: {
        deleted_at: null,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "providers_platforms",
      "providers_platforms_slug"
    );
    await queryInterface.dropTable("providers_platforms");
  },
};