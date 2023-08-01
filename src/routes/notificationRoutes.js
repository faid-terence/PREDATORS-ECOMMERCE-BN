/* eslint-disable */
import { Router } from 'express';
import {
  isLoggedIn
} from '../middleware/roles.js';
import { getAllNotifications, markNotificationAsRead, deleteNotification ,markAllAsRead} from '../controller/notificationController.js';

const router = Router();
router.get('/notification',isLoggedIn, getAllNotifications);
router.put('/notification/mark-all-as-read', isLoggedIn, markAllAsRead);
router.put('/notification/:notificationId', isLoggedIn, markNotificationAsRead);
router.delete('/notification/:notificationId', isLoggedIn, deleteNotification);



export default router;
