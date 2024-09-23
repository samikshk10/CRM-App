"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE TRIGGER trigger_create_contact_activity_timeline_on_task_creation
      AFTER INSERT
      ON providers_tasks
      FOR EACH ROW
      EXECUTE FUNCTION create_contact_activity_timeline('providers_tasks', 'TASK_CREATED');
    `);

    await queryInterface.sequelize
      .query(`CREATE TRIGGER trigger_create_contact_activity_timeline_on_contact_notes_creation
      AFTER INSERT
      ON providers_contact_notes
      FOR EACH ROW
      EXECUTE FUNCTION create_contact_activity_timeline('providers_contact_notes', 'NOTE_ADDED');
    `);

    await queryInterface.sequelize.query(`CREATE TRIGGER trigger_create_contact_activity_timeline_on_contacts_creation
      AFTER INSERT
      ON providers_contacts
      FOR EACH ROW
      EXECUTE FUNCTION create_contact_activity_timeline('providers_contacts', 'CONTACT_ADDED');
    `);

    await queryInterface.sequelize.query(`CREATE TRIGGER trigger_create_contact_activity_timeline_on_contacts_assigned
      AFTER INSERT
      ON providers_chat_sessions
      FOR EACH ROW
      EXECUTE FUNCTION create_contact_activity_timeline('providers_chat_sessions', 'CONTACT_ASSIGNED');
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_create_contact_activity_timeline_on_task_creation ON providers_tasks;
    `);
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_create_contact_activity_timeline_on_contact_notes_creation ON providers_contact_notes;
    `);
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_create_contact_activity_timeline_on_contacts_creation ON providers_contacts;
    `);
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_create_contact_activity_timeline_on_contacts_assigned ON providers_chat_sessions;
    `);
  },
};
