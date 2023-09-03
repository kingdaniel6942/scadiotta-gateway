/* Daniel De Narváez Ordoñez 2020-07-07 */

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name:{
        type: DataTypes.STRING(50),
        allowNull: true
      },
      email:{
        type: DataTypes.STRING(50),
        allowNull: false
      },
      password:{
        type: DataTypes.STRING(50),
        allowNull: true
      },
      phone:{
        type: DataTypes.STRING(50),
        allowNull: true
      },
      document:{
        type: DataTypes.STRING(50),
        allowNull: false
      },
      state: {
          type:DataTypes.ENUM({
            values: ['ENABLED', 'DISABLED']
          }),
          allowNull: true
      },
      role: {
          type:DataTypes.ENUM({
            values: ['ADMIN', 'EDIT', 'CONTROL', 'VIEW']
          }),
          allowNull: true
      }
    });
    User.associate = models => {
      User.belongsTo(models.Company, { as: 'company', foreignKey: {name: 'companyId', allowNull: true}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
    }
    return User;
};
  