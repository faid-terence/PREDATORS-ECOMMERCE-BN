import { checkout } from "../controller/checkoutController.js";
import { Router } from "express";
import { isBuyer,RestrictPassword } from "../middleware/roles.js";
const router = Router();


router.post("/checkout", isBuyer,RestrictPassword, checkout);

export default router;