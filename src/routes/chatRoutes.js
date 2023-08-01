import { Router } from 'express';
import chatController from '../controller/chatController.js';

const router = Router();

router.route('/post/room').post(chatController.createRoom);
router.route('/post/chat').post(chatController.createChat);
router.route('/post/socket').post(chatController.createSocketConnection);
router.route('/post/roomSocketConnection').post(chatController.createRoomSocketConnection);
router.route('/post/socketToRoom').post(chatController.addSocketsToRoom);
router.route('/post/getRoomByName').post(chatController.getRoomByName);

router.route('/get/rooms').get(chatController.getRooms);
router.route('/get/chat/:roomId').get(chatController.getChatByRoom);
router.route('/get/roomById/:id').get(chatController.getRoomById);
router.route('/get/sockets').get(chatController.getSocketConnections);
router.route('/get/socketById/:id').get(chatController.getSocketConnectionById);
router.route('/get/roomSocketConnections').get(chatController.getRoomSocketConnections);

router.route('/put/room').put(chatController.updateRoom);
router.route('/put/socket').put(chatController.updateSocketConnection);

router.route('/delete/room/:id').delete(chatController.deleteRoom);
router.route('/delete/socket').delete(chatController.deleteSocketConnection);
router.route('/delete/roomSocketConnection').delete(chatController.createRoomSocketConnection);

// HELPER METHOD ROUTES
router.route('/helper/identify').post(chatController.resolve);
router.route('/delete/allRecords').delete(chatController.deleteAllRecords);
router.route('/verify/token/:token').get(chatController.getTokenData);

export default router;
