"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("providers_user_social_credentials", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      platform_id: {
        type: Sequelize.BIGINT,
        references: {
          model: "providers_platforms",
          key: "id",
        },
      },
      owner_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "authenticator_users",
          key: "id",
        },
      },
      credentials: {
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
      "providers_user_social_credentials",
      ["owner_id", "platform_id"],
      {
        concurrently: true,
        unique: true,
        type: "UNIQUE",
        name: "providers_user_social_credentials_owner_id_platform_id",
        where: {
          deleted_at: null,
        },
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "providers_user_social_credentials",
      "providers_user_social_credentials_owner_id_platform_id"
    );
    await queryInterface.dropTable("providers_user_social_credentials");
  },
};