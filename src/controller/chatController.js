/* eslint-disable no-console */
import db from '../database/models/index.js';
import JwtUtility from '../utils/jwt.js';

class ChatController {
  static async createRoom(req, res) {
    try {
      const { name } = req.body;
      const room = await db.Room.create({
        name,
      });
      return res.status(201).json(room);
    } catch (error) {
      return res.status(500).json({ error: `Failed to create room: ${error}` });
    }
  }

  static async getRooms(req, res) {
    try {
      const rooms = await db.Room.findAll();
      return res.status(200).json(rooms);
    } catch (error) {
      return res.status(500).json({ error: `Failed to get rooms: ${error}` });
    }
  }

  static async getRoomById(req, res) {
    try {
      const { id } = req.params;

      const room = await db.Room.findByPk(id);

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      return res.status(200).json(room);
    } catch (error) {
      return res.status(500).json({ error: `Failed to get room: ${error}` });
    }
  }

  static async getRoomByName(req, res) {
    try {
      const { name } = req.body;

      const room = await db.Room.findOne({ where: { name } });

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      return res.status(200).json(room);
    } catch (error) {
      return res.status(500).json({ error: `Failed to get room: ${error}` });
    }
  }

  static async updateRoom(req, res) {
    try {
      const { roomId } = req.params;
      const { name } = req.body;
      const room = await db.Room.findByPk(roomId);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      room.name = name;
      await room.save();
      return res.status(201).json(room);
    } catch (error) {
      return res.status(500).json({ error: `Failed to update room: ${error}` });
    }
  }

  static async deleteRoom(req, res) {
    try {
      const { id } = req.params;
      const room = await db.Room.findByPk(id);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      await room.destroy();
      return res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Failed to delete room: ${error.message}` });
    }
  }

  static async createSocketConnection(req, res) {
    try {
      const { socketId, ipAddress, connectedAt } = req.body;
      const socketConnection = await db.SocketConnection.create({
        socketId,
        ipAddress,
        connectedAt,
      });
      return res.status(201).json(socketConnection);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Error creating socket connection:: ${error.message}` });
    }
  }

  static async getSocketConnections(req, res) {
    try {
      const socketConnections = await db.SocketConnection.findAll();
      return res.status(200).json(socketConnections);
    } catch (error) {
      return res
        .status(500)
        .json({ Error: `Error getting socket connections:${error.message}` });
    }
  }

  static async getSocketConnectionById(req, res) {
    try {
      const { id } = req.params;
      const socketConnection = await db.SocketConnection.findByPk(id);
      if (!socketConnection) {
        return res.status(404).json({ error: 'Socket connection not found' });
      }
      return res.status(200).json(socketConnection);
    } catch (error) {
      return res
        .status(500)
        .json({ Error: `Error getting socket connection:${error.message}` });
    }
  }

  static async updateSocketConnection(req, res) {
    try {
      const { socketId, dataToUpdate } = req.body;
      const socketConnection = await db.SocketConnection.findByPk(socketId);
      if (!socketConnection) {
        return res.status(404).json({ error: 'Socket connection not found' });
      }
      const updatedSocketConnection = await db.socketConnection.update(
        dataToUpdate,
      );
      return res.status(200).json(updatedSocketConnection);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Error updating socket connection:${error.message}` });
    }
  }

  static async deleteSocketConnection(req, res) {
    try {
      const { id } = req.body;
      const socketConnection = await db.SocketConnection.findByPk(id);
      if (!socketConnection) {
        return res.status(200).json({ message: ' No Socket to delete!' });
      }
      await socketConnection.destroy();
      return res.status(200).json({ message: 'Socket connection deleted' });
    } catch (error) {
      return res.status(500).json({
        error: `Error in deleting socket connection:${error.message}`,
      });
    }
  }

  static async createRoomSocketConnection(req, res) {
    try {
      const { roomId, socketConnectionId } = req.body;
      const roomSocketConnection = await db.RoomSocketConnection.create({
        roomId,
        socketConnectionId,
      });
      res.status(200).json(roomSocketConnection);
      return roomSocketConnection;
    } catch (error) {
      return res.status(500).json({
        error: `Error creating room socket connection:${error.message}`,
      });
    }
  }

  static async getRoomSocketConnections(req, res) {
    try {
      const roomSocketConnections = await db.RoomSocketConnection.findAll();
      res.status(200).json(roomSocketConnections);
      return roomSocketConnections;
    } catch (error) {
      return res.status(500).json({
        error: `Error getting room socket connections:${error.message}`,
      });
    }
  }

  static async deleteRoomSocketConnection(req, res) {
    try {
      const { roomId, socketConnectionId } = req.body;
      const roomSocketConnection = await db.RoomSocketConnection.findOne({
        where: {
          roomId,
          socketConnectionId,
        },
      });
      if (!roomSocketConnection) {
        return res
          .status(404)
          .json({ Error: 'Room socket connection not found' });
      }
      await roomSocketConnection.destroy();
      return res
        .status(200)
        .json({ message: 'Room socket connection deleted' });
    } catch (error) {
      return res.status(500).json({
        Error: `Error deleting room socket connection:${error.message}`,
      });
    }
  }

  static async addSocketsToRoom(req, res) {
    try {
      const { socketId, roomId } = req.body;
      const room = await db.Room.findByPk(roomId);
      if (!room) {
        return res.status(404).json({ Error: 'Room not found' });
      }
      const socket = await db.SocketConnection.findOne({ where: { socketId } });
      if (!room) {
        return res.status(404).json({ Error: 'Socket not found' });
      }
      await room.addSocketConnection(socket);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({
        error: `Error saving room socket connections to rooms:${error}`,
      });
    }
  }

  static async getSocketsInRoom(req, res) {
    try {
      const { id } = req.body;
      const room = db.Room.findByPk(id);
      if (!room) {
        return res.status(404).json({ error: 'room does not exist in db' });
      }
      const sockets = await room.getSocketConnections();
      return res.status(200).json(sockets);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Error getting sockets inside room: ${error.message}` });
    }
  }

  static async createChat(req, res) {
    try {
      const { message, roomId, userId } = req.body;
      const chat = await db.Chat.create({
        message,
        roomId,
        userId,
      });
      return res.status(201).json(chat);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Error saving chat in the db: ${error.message}` });
    }
  }

  static async getChatByRoom(req, res) {
    try {
      const { roomId } = req.params;
      const chats = await db.Chat.findAll({
        where: {
          roomId,
        },
        include: [
          { model: db.User, as: 'User' },
        ],
      });
      return res.status(200).json(chats);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Error getting chats: ${error.message}` });
    }
  }

  static async resolve(req, res) {
    const { target } = req.body;
    let entityType = null;
    try {
      const room = await db.Room.findOne({ where: { name: target } });
      if (!room) {
        const socket = await db.SocketConnection.findOne({
          where: { socketId: target },
        });
        entityType = socket ? 'client' : null;
      } else {
        entityType = 'room';
      }
      return res.status(200).json(entityType);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Error resolving target type: ${error.message}` });
    }
  }

  static async deleteAllRecords(req, res) {
    try {
      // Delete all records in roomSocketConnection table
      await db.RoomSocketConnection.destroy({
        where: {},
        truncate: true,
      });

      // Delete all records in socketconnection table
      await db.Socketconnection.destroy({
        where: {},
        truncate: true,
      });

      // Delete all records in rooms table
      await db.Rooms.destroy({
        where: {},
        truncate: true,
      });

      return res
        .status(200)
        .json({ message: 'All records deleted successfully.' });
    } catch (error) {
      return res
        .status(500)
        .json({ error: `:Error deleting records: ${error.message}` });
    }
  }

  static async getTokenData(req, res) {
    try {
      const { token } = req.params;
      const decodedToken = JwtUtility.verifyToken(token);

      const user = await db.User.findOne({
        where: { id: decodedToken.value.id },
      });

      if (!user) return res.status(400).json({ error: 'User not found' });
      return res.status(200).json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Error resolving token: ${error.message}` });
    }
  }
}

export default ChatController;
