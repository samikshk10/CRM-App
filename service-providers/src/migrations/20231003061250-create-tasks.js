"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("providers_tasks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING(100),
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
      type_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "providers_task_types",
          key: "id",
        },
      },
      assignee_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "authenticator_users",
          key: "id",
        },
      },
      due_date: {
        type: Sequelize.DATE,
      },
      reminder_date: {
        type: Sequelize.DATE,
      },
      completed_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      parent_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "providers_tasks",
          key: "id",
        },
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
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
      reporter_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "authenticator_users",
          key: "id",
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex("providers_tasks", ["owner_id"], {
      concurrently: true,
      unique: false,
      name: "providers_tasks_owner_id",
      where: {
        deleted_at: null
      },
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "providers_tasks",
      "providers_tasks_owner_id"
    );
    await queryInterface.dropTable("providers_tasks");
  },
};