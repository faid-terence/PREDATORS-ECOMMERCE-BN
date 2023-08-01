"use strict";

import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      
      Notification.belongsTo(models.User, {
        foreignKey: "id",
        onDelete: "CASCADE",
      });
    };
    static async findAndPaginateAll({page=1, limit=10, where = {}}) {
      const offset = (page - 1) * limit;
      const notifications = await Notification.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });
      const totalPages = Math.ceil(notifications.count / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      return {
        notifications: notifications.rows,
        pagination: {
          totalPages,
          hasPrevPage,
          hasNextPage,
          currentPage: page,
          totalItems: notifications.count,
        },
      };
    }
  };
  
  Notification.init(
    {
      user_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      message: DataTypes.STRING,
      is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
      receive_notifications: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );

  return Notification;
};
