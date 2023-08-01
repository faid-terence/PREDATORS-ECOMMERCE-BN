// routers/discountCoupon.js
import express from 'express';
import { createCoupon, getCoupons, getCouponById, updateCoupon, deleteCoupon } from '../controller/discountCouponController.js';
import { isSeller,RestrictPassword } from '../middleware/roles.js';

const router = express.Router();

// Create a new discount coupon
router.post('/createCoupon',isSeller, createCoupon);

// Get all discount coupons for a seller's account
router.get('/getCoupons',isSeller,RestrictPassword, getCoupons);
router.get('/getCoupons/:id', isSeller,RestrictPassword, getCouponById)
router.delete('/deleteCoupons/:id', isSeller,RestrictPassword, deleteCoupon)
router.put('/updateCoupon/:id', isSeller,RestrictPassword, updateCoupon)

export default router;
