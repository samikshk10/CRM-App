"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("providers_chat_sessions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'authenticator_users',
          key: 'id',
        },
      },
      contact_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "providers_contacts",
          key: "id",
        },
      },
      message_platform_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "providers_platforms",
          key: "id",
        },
      },
      status: {
        type: Sequelize.ENUM(
          'OPEN',
          'CLOSED',
        ),
        allowNull: false,
      },
      assignee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "authenticator_users",
          key: "id",
        },
      },
      reporter_id: {
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

    await queryInterface.addIndex(
      "providers_chat_sessions",
      ["owner_id","contact_id", "message_platform_id","status"],
      {
        concurrently: true,
        unique: true,
        type: "UNIQUE",
        name: "providers_chat_sessions_owner_id_contact_id_message_platform_id_status",
        where: {
          deleted_at: null,
        },
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "providers_chat_sessions",
      "providers_chat_sessions_owner_id_contact_id_message_platform_id_status"
    );
    await queryInterface.dropTable("providers_chat_sessions");
  },
};