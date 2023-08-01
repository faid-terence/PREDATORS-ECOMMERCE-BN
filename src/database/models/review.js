'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, {
        foreignKey: 'buyer_id',
        as: 'buyer',
      });

      Review.belongsTo(models.Product, {
        foreignKey: 'id',
        as: 'product',
      });
      
    }
  }
  Review.init({
    buyer_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    rating: DataTypes.DECIMAL,
    feedback: DataTypes.STRING,
 
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};