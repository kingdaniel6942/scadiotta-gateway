module.exports = function(sequelize, DataTypes) {
    var ChartPage = sequelize.define('ChartPage', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      url: {
        type: DataTypes.STRING(400),
        allowNull: false
      },
      tittle: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      width: {
        type: DataTypes.SMALLINT,
        allowNull: true
      },
      height: {
        type: DataTypes.SMALLINT,
        allowNull: true
      },
      position: {
        type: DataTypes.SMALLINT,
        allowNull: true
      }
    });
    ChartPage.associate = models => {
      ChartPage.belongsTo(models.ClientPage, { as: 'page', foreignKey: {name: 'pageId', allowNull: false}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
    }
    return ChartPage;
};