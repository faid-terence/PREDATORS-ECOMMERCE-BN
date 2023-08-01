/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { log } from 'console';
import SocketHandler from '../src/utils/chatServer.js';
import chatsDb from '../src/services/chatsDb.services.js';

chai.use(chaiAsPromised);
const { assert } = chai;

describe('SocketHandler', () => {
  let socketHandler;
  let io;
  let socket;
  let chatsDbSaveSocketInstanceStub;
  let chatsDbDeleteSocketInstanceStub;
  let chatsDbGetInRoomStub;
  let chatsDbSolveTargetTypeStub;
  let chatsDbFetchChatHistoryStub;
  let chatsDbSaveChatStub;
  let consoleLogStub;

  beforeEach(() => {
    io = {
      on: sinon.stub(),
    };
    socket = {
      id: 'socket-id',
      handshake: {
        address: 'socket-address',
        time: 'socket-time',
        query: {
          user: 'socket-user',
          id: 'socket-user-id',
        },
      },
      join: sinon.stub(),
      emit: sinon.stub(),
      on: sinon.stub(),
      to: sinon.stub().returns({ emit: sinon.stub() }),
      broadcast: {
        emit: sinon.stub(),
      },
    };

    // Stubbing chatsDb methods
    chatsDbSaveSocketInstanceStub = sinon
      .stub(chatsDb, 'saveSocketInstance')
      .resolves('db-id');
    chatsDbDeleteSocketInstanceStub = sinon
      .stub(chatsDb, 'deleteSocketInstance').withArgs('dbId')
      .resolves('deleted.');
    chatsDbGetInRoomStub = sinon
      .stub(chatsDb, 'getInRoom')
      .resolves('room-data');
    chatsDbSolveTargetTypeStub = sinon
      .stub(chatsDb, 'solveTargetType')
      .resolves('room');
    chatsDbFetchChatHistoryStub = sinon
      .stub(chatsDb, 'fetchChatHistory')
      .resolves([]);
    chatsDbSaveChatStub = sinon.stub(chatsDb, 'saveChat').resolves();

    socketHandler = new SocketHandler(io);

    consoleLogStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    sinon.restore();
    consoleLogStub.restore();
  });

  describe('onConnection', () => {
    it('should save socket instance to db', async () => {
      await socketHandler.onConnection(socket);

      sinon.assert.calledOnceWithExactly(
        chatsDbSaveSocketInstanceStub,
        socket.id,
        socket.handshake.address,
        socket.handshake.time,
      );
      assert.equal(socketHandler.dbId, 'db-id');
    });

    it('should emit "server-message" event with "[You\'re Connected]"', async () => {
      await socketHandler.onConnection(socket);

      sinon.assert.calledOnceWithExactly(
        socket.emit,
        'server-message',
        "[You're Connected]",
      );
    });

    it('should bind event handlers', async () => {
      await socketHandler.onConnection(socket);

      sinon.assert.calledWith(socket.on, 'public-message', sinon.match.func);
      sinon.assert.calledWith(socket.on, 'private-message', sinon.match.func);
      sinon.assert.calledWith(socket.on, 'join', sinon.match.func);
      sinon.assert.calledWith(socket.on, 'disconnect', sinon.match.func);
    });
  });

  describe('handleDisconnect', () => {
    it('should delete socket instance from db and emit "message" event', async () => {
      await socketHandler.handleDisconnect(socket);

      sinon.assert.calledOnceWithExactly(chatsDb.deleteSocketInstance, socketHandler.dbId);
      sinon.assert.calledOnceWithExactly(
        socket.broadcast.emit,
        'server-message',
        `User disconnected: [${socket.id}].`,
      );
    });
  });
});
