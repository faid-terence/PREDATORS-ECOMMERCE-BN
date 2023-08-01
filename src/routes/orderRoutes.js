import { Router } from 'express';
import { getOrderStatus, updateOrderStatus, getAllUserOrder } from '../controller/checkoutController.js';
import { isAdmin } from '../middleware/roles.js';
const router = Router();
router.get('/status/:orderId', getOrderStatus);
router.get('/my/orders', getAllUserOrder);
router.patch('/status/:orderId', isAdmin, updateOrderStatus);
export default router;