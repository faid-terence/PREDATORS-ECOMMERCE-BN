/* eslint-disable */
'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      wishlist.belongsTo(models.User, {
        foreignKey: 'id',
        onDelete: 'CASCADE',
      });
      wishlist.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
      });
    }
  }
  wishlist.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
  
  }, {
    sequelize,
    modelName: 'wishlist',
  });
  return wishlist;
};