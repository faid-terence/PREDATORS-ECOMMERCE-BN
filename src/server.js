import { Server } from 'socket.io';
import SocketHandler from './utils/chatServer.js';
import app from './app.js';

const PORT = process.env.PORT || 3000;
// Listen to Port ( default: 3000 )
const server = app.listen(PORT, () => {
  console.log(`I am in ${process.env.NODE_ENV} environment`);
  console.log(`[Server@${PORT}] On`);
});

// Socket.io server.
const io = new Server(server);

// Socket Connections Handler
const chatHandler = new SocketHandler(io);

// Handle all sockets using the bound chatHandler instance.
io.on('connection', chatHandler.onConnection.bind(chatHandler));
