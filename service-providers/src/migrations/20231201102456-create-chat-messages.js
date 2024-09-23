"use strict";

const sequelize = require('sequelize');

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "providers_chat_messages", {
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
          model: 'authenticator_users',
          key: 'id',
        },
      },
      chat_session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'providers_chat_sessions',
          key: 'id',
        },
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'authenticator_users',
          key: 'id',
        },
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      direction: {
        type: Sequelize.ENUM('INCOMING', 'OUTGOING'),
        allowNull: false,
      },
      message_type: {
        type: Sequelize.ENUM('INTERNAL', 'EXTERNAL'),
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("now()::Date"),
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
      "providers_chat_messages",
      ["owner_id", "chat_session_id", "sender_id", "message_type", "direction"], {
      concurrently: true,
      unique: true,
      type: "UNIQUE",
      name: "providers_chat_messages_owner_id_chat_session_id_sender_id_message_type_direction",
      where: {
        deleted_at: null
      },
    }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "providers_chat_messages",
      "providers_chat_messages_owner_id_chat_session_id_sender_id_message_type_direction"
    );

    await queryInterface.dropTable("providers_chat_messages");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_providers_chat_messages";'
    );
  }
};