'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Activities.hasMany(models.Clusters, {
      //   foreignKey: 'activityId',
      //   as: 'clusters',
      // });
    }
  };
  Activities.init({
    activityName: DataTypes.STRING,
    activityPlace: DataTypes.STRING,
    objects: DataTypes.STRING,
    clusters: DataTypes.STRING(10000),
  }, {
    sequelize,
    modelName: 'Activities',
    timestamps: false,
  });
  return Activities;
};