'use strict';
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      defaultValue: false,
    },
  });
  Employee.associate = function(models) {
    // associations can be defined here
    Employee.belongsTo(models.Company,{
      foreignKey: 'companyId',
      ondelete: 'CASCADE',
    });
  };
  return Employee;
};