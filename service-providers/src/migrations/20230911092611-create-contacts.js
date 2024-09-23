"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("providers_contacts", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "authenticator_users",
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING(50),
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      address: {
        type: Sequelize.STRING(50),
      },
      company: {
        type: Sequelize.STRING(50),
      },
      company_domain: {
        type: Sequelize.STRING(100),
      },
      contact_number: {
        type: Sequelize.STRING(20),
      },

      status: {
        type: Sequelize.ENUM([
          "WON",
          "IN_CONVERSATION",
          "IN_NEGOTIATION",
          "LOST",
        ]),
      },
      source: {
        type: Sequelize.ENUM([
          "FACEBOOK",
          "FROM_CONTACTS",
          "INSTAGRAM",
          "WHATSAPP",
          "MANUALLY",
        ]),
        allowNull: false,
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

    await queryInterface.addIndex("providers_contacts", ["owner_id", "email"], {
      concurrently: true,
      unique: true,
      type: "UNIQUE",
      name: "providers_contacts_owner_id_email",
      where: {
        deleted_at: null
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "providers_contacts",
      "providers_contacts_owner_id_email"
    );
    await queryInterface.dropTable("providers_contacts");
  },
};