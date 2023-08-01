import { Router } from "express";
import {getAllProducts, getProductById, updateProduct, deleteSpecificProduct} from '../controller/productController.js';
import { get_collection, get_available_products } from "../controller/productListingController.js";
import { isAdmin, isSeller, isBuyer, checkPermission,RestrictPassword } from "../middleware/roles.js";
import  productSearch from '../controller/search.controller.js';
import jsend from 'jsend';
import { addProduct, showCatalogue } from '../controller/prodController.js';
import db from '../database/models/index.js';

const router = Router();

router.post('/product', isSeller, addProduct);
router.get('/product/available/', isSeller, showCatalogue);
router.get('/product', getAllProducts);
router.get('/product/:id', getProductById);
router.put('/product/:id', isSeller, updateProduct);
router.delete('/product/:id', isSeller, deleteSpecificProduct);
router.get('/products/search', productSearch);
router.get('/user/products', isBuyer, get_available_products);
router.post('/vendor/collection', isSeller, get_collection);


export default router;
