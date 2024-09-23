'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("providers_chat_sessions", "created_by_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "authenticator_users",
        key: "id",
      },
    });

    await queryInterface.addColumn("providers_chat_sessions", "updated_by_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "authenticator_users",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("providers_chat_sessions", "updated_by_id");
    await queryInterface.removeColumn("providers_chat_sessions", "created_by_id");
  },
};
