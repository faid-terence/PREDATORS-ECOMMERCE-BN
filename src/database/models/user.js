"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Roles, {
        foreignKey: "roleId",
        as: "role",
        onDelete: "CASCADE",
      });
      User.hasMany(models.wishlist, {
        foreignKey: "id",
        as: "wishlist",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Chat, {
        foreignKey: "userId", // the "userId" is the name of the foreign key in Chat and User models.
        as: 'Chats', // the "chats" is the name of the association in the current model and the one in the associated model.  This should probably be
      });
      User.hasMany(models.Product, {
        foreignKey: "vendor_id",
        as: "products",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Cart_items, {
        foreignKey: "id",
        as: "cart_items",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Notification, {
        foreignKey: "id",
        as: "notifications",
      });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    roleId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    googleId: DataTypes.TEXT,
    gender: DataTypes.STRING,
    otp_enabled: DataTypes.BOOLEAN,
    otp_verified: DataTypes.BOOLEAN,
    otp_ascii: DataTypes.STRING,
    otp_hex: DataTypes.STRING,
    otp_base32: DataTypes.STRING,
    otp_auth_url: DataTypes.STRING,
    preferred_language: DataTypes.STRING,
    preferred_currency: DataTypes.STRING,
    country: DataTypes.STRING,
    province: DataTypes.STRING,
    district: DataTypes.STRING,
    sector: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    receive_notifications: DataTypes.BOOLEAN,
    last_password_update: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
