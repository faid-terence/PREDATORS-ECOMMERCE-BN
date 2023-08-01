import { Router } from 'express';
import jsend from 'jsend';
import { addProduct, showCatalogue } from '../controller/prodController.js';
import { isSeller,RestrictPassword } from '../middleware/roles.js';
import db from '../database/models/index.js';

const router = Router();

router.post('/new', isSeller, addProduct);
router.get('/available/', isSeller, showCatalogue);

export default router;
