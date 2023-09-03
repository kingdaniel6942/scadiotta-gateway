/* Daniel De Narváez Ordoñez 2020-07-07 */

module.exports = function(sequelize, DataTypes) {
    var ClientsSignals = sequelize.define('ClientsSignals', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      signalId:{
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
    ClientsSignals.associate = models => {
      ClientsSignals.belongsTo(models.Company, { as: 'company', foreignKey: {name: 'companyId', allowNull: false}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
    }
    return ClientsSignals;
};
  