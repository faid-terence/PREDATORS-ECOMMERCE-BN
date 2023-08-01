import { Router } from 'express';
import { isBuyer } from '../middleware/roles.js';
import { makePayment, confirmPayment, cancelPayment } from '../controller/paymentController.js';

const router = new Router();

router.get('/order', isBuyer, makePayment);
router.get('/success', confirmPayment);
router.get('/cancel', cancelPayment);

export default router;
