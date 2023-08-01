import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.belongsToMany(models.SocketConnection, {
        through: models.RoomSocketConnection,
        foreignKey: 'roomId', // Specify the custom foreign key column for Room
        otherKey: 'socketConnectionId',
      });
      Room.hasMany(models.Chat, { as: 'Chat', foreignKey: 'roomId' });
    }
  }
  Room.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};
