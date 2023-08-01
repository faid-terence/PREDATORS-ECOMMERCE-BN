/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Cart_items', [
      {
        User_id: 1,
        product_id: 1,
        quantity: 1,
        amount: 2000.00,
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cart_items', null, {});
  },
};
