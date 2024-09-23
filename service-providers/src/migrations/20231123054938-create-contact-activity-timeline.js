"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("providers_contacts_activity_timeline", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      contact_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "providers_contacts",
          key: "id",
        },
      },
      activity_by_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "authenticator_users",
          key: "id",
        },
      },
      reference_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      reference_relation: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      type: {
        type: Sequelize.ENUM(
          "CONTACT_ADDED",
          "CONTACT_ASSIGNED",
          "TASK_CREATED",
          "NOTE_ADDED",
          "MAIL_SENT",
        ),
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("providers_contacts_activity_timeline");
  },
};
