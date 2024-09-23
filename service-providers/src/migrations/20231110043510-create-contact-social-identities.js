"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("providers_contact_social_identities", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "authenticator_users",
          key: "id",
        },
      },
      user_social_credential_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "providers_user_social_credentials",
          key: "id",
        },
      },
      contact_access_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      meta: {
        type: Sequelize.JSONB,
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

    await queryInterface.addIndex(
      "providers_contact_social_identities",
      ["owner_id", "user_social_credential_id"],
      {
        concurrently: true,
        unique: true,
        type: "UNIQUE",
        name: "providers_contact_social_identities_owner_id_user_social_credential_id",
        where: {
          deleted_at: null,
        },
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "providers_contact_social_identities",
      "providers_contact_social_identities_owner_id_user_social_credential_id"
    );
    await queryInterface.dropTable("providers_contact_social_identities");
  },
};