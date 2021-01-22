'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Images extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Images.belongsTo(models.Clusters, {
      //   foreignKey: 'clusterId',
      //   as: 'cluster',
      // })
    }
  };
  Images.init({
    imageId: DataTypes.STRING,
    caption: DataTypes.STRING,
    clusterId: DataTypes.STRING,
    objects: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Images',
    timestamps: false,
  });
  return Images;
};