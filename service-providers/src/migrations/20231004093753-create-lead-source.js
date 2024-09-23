    "use strict";

    /** @type {import('sequelize-cli').Migration} */

    module.exports = {
      async up(queryInterface, Sequelize) {
        await queryInterface.createTable("providers_lead_sources", {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          social_media_type: {
            type: Sequelize.ENUM("FACEBOOK", "WHATSAPP", "INSTAGRAM", "VIBER", "EMAIL"),
            allowNull: false,
          },
          owner_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'authenticator_users',
              key: 'id',
            },
          },
          social_id: {
            type: Sequelize.STRING,
            allowNull: false
          },
          social_name: {
            type: Sequelize.STRING(50),
            allowNull: false,
          },
          avatar_url: {
            type: Sequelize.STRING,
            allowNull: false
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
          "providers_lead_sources",
          ["owner_id", "social_id", "social_media_type"], {
            concurrently: true,
            unique: true,
            type: "UNIQUE",
            name: "providers_lead_sources_owner_id_social_id_social_media_type",
            where: {
              deleted_at: null
            },
          }
        );

      },
      async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex(
          "providers_lead_sources",
          "providers_lead_sources_owner_id_social_id_social_media_type"
        );

        await queryInterface.dropTable("providers_lead_sources");

        await queryInterface.sequelize.query(
          'DROP TYPE IF EXISTS "enum_providers_lead_sources_social_media_type";'
        );
      },
    };