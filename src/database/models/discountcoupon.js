'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class DiscountCoupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DiscountCoupon.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
      });
    }
  }
  DiscountCoupon.init({
    code: DataTypes.STRING,
    discountPercentage: DataTypes.FLOAT,
    expiresAt: DataTypes.DATE,
    productId: DataTypes.INTEGER, 
    vendor_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DiscountCoupon',
  });
  return DiscountCoupon;
};