"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize
      .query(`CREATE OR REPLACE FUNCTION create_contact_activity_timeline()
    RETURNS TRIGGER AS
    $$
    DECLARE
      contact_id int8;
    BEGIN
    IF TG_ARGV[1] = 'CONTACT_ADDED' THEN
      contact_id := NEW.id;
    ELSE
      contact_id := NEW.contact_id;
    END IF;
        INSERT INTO providers_contacts_activity_timeline 
          (contact_id, activity_by_id, reference_id, reference_relation, type, created_at, updated_at)
          VALUES
          (contact_id, NEW.created_by_id, NEW.id, TG_ARGV[0], TG_ARGV[1]::public.enum_providers_contacts_activity_timeline_type, NOW(), NOW());
        RETURN NEW;
    END;
    $$
    LANGUAGE plpgsql;`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS create_contact_activity_timeline(varchar, varchar);
    `);
  },
};
