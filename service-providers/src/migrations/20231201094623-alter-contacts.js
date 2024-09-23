"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("providers_contacts", "profile_picture_id", {
      type: Sequelize.INTEGER,
      references: {
        model: 'upload_medias',
        key: 'id'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("providers_contacts", "profile_picture_id");
  },
}