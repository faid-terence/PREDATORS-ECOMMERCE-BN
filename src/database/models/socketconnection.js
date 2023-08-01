import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class SocketConnection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SocketConnection.belongsToMany(models.Room, {
        through: models.RoomSocketConnection,
        foreignKey: 'socketConnectionId',
        otherKey: 'roomId',
      });
    }
  }
  SocketConnection.init({
    socketId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    connectedAt: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'SocketConnection',
  });
  return SocketConnection;
};
