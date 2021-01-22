'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clusters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Clusters.hasMany(models.Images, {
      //   foreignKey: 'clusterId',
      //   as: 'images',
      // });
      // Clusters.belongsTo(models.Activites, {
      //   foreignKey: 'activityId',
      //   as: 'activity',
      // });
    }
  };
  Clusters.init({
    clusterId: DataTypes.STRING,
    clusterName: DataTypes.STRING,
    clusterPlace: DataTypes.STRING,
    candidate: DataTypes.STRING,
    // activityId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Clusters',
    timestamps: false,
  });
  return Clusters;
};