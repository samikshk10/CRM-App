"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("providers_contact_notes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      contact_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "providers_contacts",
          key: "id",
        },
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

    await queryInterface.addIndex("providers_contact_notes", ["owner_id", "contact_id"], {
      concurrently: true,
      unique: false,
      name: "providers_contact_notes_owner_id_contact_id",
      where: {
        deleted_at: null,
      },
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "providers_contact_notes",
      "providers_contact_notes_owner_id_contact_id"
    );
    await queryInterface.dropTable("providers_contact_notes");
  },
};