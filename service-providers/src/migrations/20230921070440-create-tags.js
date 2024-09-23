'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('providers_tags', {
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
        }
      },
      name: {
        type: Sequelize.STRING(50),
      },
      slug: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      color: {
        type: Sequelize.STRING(7),
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

    await queryInterface.addIndex('providers_tags', ['owner_id', 'slug'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'providers_tags_owner_id_slug',
      where: {
        deleted_at: null
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      'providers_tags',
      'providers_tags_owner_id_slug'
    );
    await queryInterface.dropTable('providers_tags');
  },
};