import express from "express";
import {addWishlist,deleteFromWishlist,getWishlist} from "../controller/wishlistController.js";
import {isBuyer,RestrictPassword } from "../middleware/roles.js";

const router = express.Router();

router.post("/wishlist",  isBuyer,RestrictPassword, addWishlist)
router.delete("/wishlist/:productId", RestrictPassword, isBuyer, deleteFromWishlist)
router.get("/wishlist",  isBuyer,RestrictPassword, getWishlist)


export default router;