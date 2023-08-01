'use strict';

import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {

  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Category.belongsTo(models.Product, {

        foreignKey: 'category_id',
        as: 'category',
        onDelete: 'CASCADE',
      });
    }
  }
  Category.init({
    name: DataTypes.STRING,
    category_id: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};