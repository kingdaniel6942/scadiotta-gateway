module.exports = function(sequelize, DataTypes) {
    var ClientPage = sequelize.define('ClientPage', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
    });
    ClientPage.associate = models => {
      ClientPage.belongsTo(models.Company, { as: 'company', foreignKey: {name: 'companyId', allowNull: false}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
      ClientPage.hasMany(models.ChartPage, { as: 'charts', foreignKey: {name: 'pageId', allowNull: false}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
    }
    return ClientPage;
};
  