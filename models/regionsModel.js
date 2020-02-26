module.exports = function(sequelize, DataTypes) {
    
    return sequelize.define('department', {
    buId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    });
}