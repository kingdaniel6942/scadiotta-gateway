/* Daniel De Narváez Ordoñez 2020-07-07 */

module.exports = function(sequelize, DataTypes) {
    var ClientsTopics = sequelize.define('ClientsTopics', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      topicId: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      mqttUserPub: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      mqttPwdPub: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      mqttUserSub: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      mqttPwdSub: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    });
    ClientsTopics.associate = models => {
      ClientsTopics.belongsTo(models.Company, { as: 'company', foreignKey: {name: 'companyId', allowNull: false}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
    }
    return ClientsTopics;
};
  