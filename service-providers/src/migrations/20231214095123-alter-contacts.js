'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("providers_contacts", "created_by_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "authenticator_users",
        key: "id",
      },
    });

    await queryInterface.addColumn("providers_contacts", "updated_by_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "authenticator_users",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("providers_contacts", "updated_by_id");
    await queryInterface.removeColumn("providers_contacts", "created_by_id");
  },
};
