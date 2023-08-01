/* eslint-disable no-trailing-spaces */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-len */
/* eslint-disable no-console */
// CLASS FOR HANDLING ALL INCOMING SOCKET CONNECTIONS
import chatsDb from '../services/chatsDb.services.js';

export default class SocketHandler {
  constructor(io) {
    this.io = io;
    this.properties = {
      id: null,
      address: null,
      connectedAt: null,
    };
    this.dbId = null;
  }

  async onConnection(socket) {
    // Configurations
    const { handshake } = socket;
    this.properties.id = socket.id;
    this.properties.address = handshake.address;
    this.properties.connectedAt = handshake.time;

    // Save socket to db here.(DURING DB INTEGRATION PHASE)
    this.dbId = await chatsDb.saveSocketInstance(this.properties.id, this.properties.address, this.properties.connectedAt);

    socket.emit('server-message', '[You\'re Connected]');

    socket.on('public-message', await this.handlePublicTransmit.bind(this, socket));

    socket.on('private-message', await this.handlePrivateTransmit.bind(this, socket));

    // Event listener for when a client joins a room
    socket.on('join', await this.handleJoin.bind(this, socket));

    socket.on('disconnect', await this.handleDisconnect.bind(this, socket));
  }

  // Send message to all Sockets
  async handlePublicTransmit(socket, msg) {
    try {
      // const message = `[${socket.handshake.query.user}] says: ${msg}`;
      const time = this.properties.connectedAt;
      const message = {
        text: msg,
        dateTime: new Date(time).toISOString(),
        src: 'public',
      };
      const userId = socket.handshake.query.id;
      console.log('Public message', msg, 'user id:', userId)
      await chatsDb.saveChat(msg, userId, 'public');

      socket.broadcast.emit('public-message', message);
    } catch (error) {
      throw new Error(error);
    }
  }

  // Send message to specific room only.
  async handlePrivateTransmit(socket, activeRoom, msg) {
    try {
      // const message = `[${socket.handshake.query.user}]: ${msg}`;
      const time = this.properties.connectedAt;
      const message = {
        text: msg,
        dateTime: new Date(time).toISOString(),
        src: 'customer_support',
      };
      const userId = socket.handshake.query.id;
      console.log('Private msg', msg, 'user id:', userId)
      await chatsDb.saveChat(msg, userId, activeRoom);

      socket.to(activeRoom).emit('room-message', activeRoom, message);
    } catch (error) {
      console.log(error)
      throw new Error(error);
    }
  }

  // When a client wants to join a room, join or create the room
  async handleJoin(socket, entity) {
    const target = await chatsDb.solveTargetType(entity);
    let feedback;
    let chatHistory = [];

    if (target === 'room') {
      const room = await chatsDb.getInRoom(socket.id, entity);
      if (!room) throw new Error('could not save new room to db.');

      this.handlePrivateTransmit(socket, entity, `[${socket.handshake.query.user}: joined the room.]`);

      chatHistory = await chatsDb.fetchChatHistory(entity);

      feedback = '[joined room successfully]';
    } else if (target === 'client') {
      this.handlePrivateTransmit(socket, entity, `[${socket.handshake.query.user}: joined the room.]`);

      feedback = `[joined user ${target}]`;
    } else {
      // Create a new room in db & save this socket in it.
      const room = await chatsDb.getInRoom(socket.id, entity, true);
      if (!room) throw new Error('could not save new room to db.');

      feedback = '[New room created!]';
    }

    // Join the target
    socket.join(entity);

    socket.emit('joined', feedback, entity, chatHistory);
  }

  // When a client disconnects, we need to remove it from the server and the db.
  async handleDisconnect(socket) {
    const message = `User disconnected: [${socket.id}].`;

    // delete socket instance from the db
    await chatsDb.deleteSocketInstance(this.dbId);

    // Tell all server clients of the disconnected client.
    socket.broadcast.emit('server-message', message);
  }
}
