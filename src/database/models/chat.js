import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chat.belongsTo(models.Room, { as: 'Room', foreignKey: 'roomId' });
      Chat.belongsTo(models.User, { as: 'User', foreignKey: 'userId' });
    }
  }
  Chat.init({
    message: DataTypes.STRING,
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Room', // references a specific model (e.g. `User`) defined on the `rooms` table. This is the table name and its columns are the same. In this case, it is "users" and the `userId` is the foreign key. The `userId` is the key to the referenced table. In this case, it is "id".
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User', // references a specific model (e.g. `User`) defined on the `rooms` table. This is the table name and its columns are the same. In this case, it is "users" and the `userId` is the foreign key. The `userId` is the key to the referenced table. In this case, it is "id".
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};
