'use strict'

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('upload_medias', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      originalname: {
        type: Sequelize.STRING,
      },
      mimetype: {
        type: Sequelize.STRING(50),
      },
      size: {
        type: Sequelize.INTEGER,
      },
      key: {
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.STRING,
      },
      log: {
        type: Sequelize.JSONB,
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
    })


  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('upload_medias')
  }
}