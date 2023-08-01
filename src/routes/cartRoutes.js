import { Router } from "express";
import { isBuyer ,RestrictPassword} from "../middleware/roles.js";
const router = Router();
import cartController from "../controller/cartController.js"; 

router.post('/', isBuyer,RestrictPassword,cartController.addCartItem);
router.get('/',isBuyer,RestrictPassword,cartController.getCartItems); 
router.put('/:id',isBuyer,RestrictPassword,cartController.updateCartItem);
router.delete('/:id',isBuyer, RestrictPassword,cartController.ClearCartItem);
router.delete('/',isBuyer, RestrictPassword,cartController.ClearAllCartItem)

export default router;