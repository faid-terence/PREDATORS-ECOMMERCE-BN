'use strict';
import { Model, DATE } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    products_info: DataTypes.JSON(10000),
    user_id: DataTypes.INTEGER,
    billing_info: DataTypes.JSON,
    status: DataTypes.STRING,
    total: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};