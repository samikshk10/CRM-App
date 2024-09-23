module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      {
      id: 3,
      label: 'PROJECT MANAGER',
      slug:'project_manager',
      level: 4,
      position: 11,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      label: 'MANAGER',
      slug:'manager',
      level: 3,
      position: 9,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 5,
      label: 'NON STAFF',
      slug:'non_staff',
      level: 8,
      position: 20,
      created_at: new Date(),
      updated_at: new Date()
    },
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {});
  }
};