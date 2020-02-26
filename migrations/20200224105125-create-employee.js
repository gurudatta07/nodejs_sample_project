'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      designation:  {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      companyId: {
        type: Sequelize.STRING,
        ondelete: 'CASCADE',
        reference:{
        model: 'Companies',
        key:'id',
        as:'companyId'
      },
    },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Employees');
  }
};