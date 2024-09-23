"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("providers_sub_tasks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      task_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "providers_tasks",
          key: "id",
        },
      },
      description: {
        type: Sequelize.STRING,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "authenticator_users",
          key: "id",
        },
      },
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    
    await queryInterface.addIndex("providers_sub_tasks", ["owner_id"], {
      concurrently: true,
      unique: false,
      name: "providers_sub_tasks_owner_id",
      where: { deleted_at: null },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "providers_sub_tasks",
      "providers_sub_tasks_owner_id"
    );

    await queryInterface.dropTable("providers_sub_tasks");
  },
};
