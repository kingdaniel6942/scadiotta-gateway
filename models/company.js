/* Daniel De Narváez Ordoñez 2020-07-07 */

module.exports = function(sequelize, DataTypes) {
    var Company = sequelize.define('Company', {
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
      image:{
        type: DataTypes.STRING(100),
        allowNull: true
      },
      nit:{
        type: DataTypes.STRING(50),
        allowNull: true
      },
      state: {
          type:DataTypes.ENUM({
            values: ['ENABLED', 'DISABLED', 'FREE_TRIAL', 'PAYMENT_DELAY', 'DISABLED_PAYMENT_DELAY']
          }),
          allowNull: true
      }
    });
    Company.associate = models => {
      Company.hasMany(models.User, { as: 'users', foreignKey: {name: 'companyId', allowNull: true}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
      Company.hasMany(models.ClientsTopics, { as: 'clientsTopics', foreignKey: {name: 'companyId', allowNull: false}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
      Company.hasMany(models.ClientsSignals, { as: 'clientsSignals', foreignKey: {name: 'companyId', allowNull: false}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
    }
    return Company;
};
  