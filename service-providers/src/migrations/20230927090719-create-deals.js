"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("providers_deals", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      contact_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "providers_contacts",
          key: "id",
        },
      },
      company: {
        type: Sequelize.STRING(50),
      },
      value: {
        type: Sequelize.INTEGER,
      },
      pipeline_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "providers_pipelines",
          key: "id",
        },
      },
      milestone_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "providers_milestones",
          key: "id",
        },
      },
      closing_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "authenticator_users",
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
      reporter_id: {
        type: Sequelize.INTEGER,
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
      "providers_deals",
      ['owner_id', 'pipeline_id', 'milestone_id'], {
        concurrently: true,
        unique: false,
        name: "providers_deals_owner_id_pipeline_id_milestone_id",
        where: {
          deleted_at: null,
        },
      }
    );

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeIndex(
      "providers_deals",
      "providers_deals_owner_id_pipeline_id_milestone_id"
    );
    await queryInterface.dropTable("providers_deals", );

  },
};