/* eslint-disable import/no-named-as-default-member */
import { Router } from 'express';
import profileController from '../controller/profileController.js';
import { getProductById } from '../controller/productController.js';
import vendor from '../controller/vendorController.js';

// Google route
import {
  GetUsers,
  GetUserById,
  DeleteUserById,
  logout,
  disableUser,
  register,
  UserLogin,
  AdminLogin,
  requestResetPassword,
  resetPasswordLink,
  resetPassword,
} from '../controller/authController.js';
import {
  isAdmin,
  isSeller,
  isBuyer,
  checkPermission,
} from '../middleware/roles.js';
import { setRole } from '../services/role.services.js';

const router = Router();

// Google routes

router.post('/vendor', vendor);
router.post('/logout', logout);
router.get('/users', isAdmin, GetUsers);
router.get('/users/:id', isAdmin, checkPermission('manage users'), GetUserById);
router.delete('/users/:id', isAdmin, checkPermission('manage users'), DeleteUserById);
router.post('/setRole/:id', isAdmin, checkPermission('manage users'), setRole);
router.post('/disableUser/:id', isAdmin, disableUser);
router.post('/login', UserLogin);
router.post('/adminLogin', AdminLogin);
router.post('/register', register);
router.patch('/profile', profileController.updateUserProfile);
router.get('/profile', profileController.getMyinfo);
router.get('/product/:id', getProductById);
router.post('/reset/password', requestResetPassword);
router.get('/user/reset-password/:token', resetPasswordLink);
router.put('/user/reset-password', resetPassword);

export default router;
