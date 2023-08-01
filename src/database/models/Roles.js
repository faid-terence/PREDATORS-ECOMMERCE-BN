'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Roles.hasMany(models.User, {
        foreignKey: 'roleId',
        as: 'users',
      });
    }
  }
  Roles.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Roles',
  });
  return Roles;
};