import { Router } from 'express';
import { addReview, getReviews } from "../controller/reviewController.js";
import { isBuyer } from "../middleware/roles.js";

const router = Router();
//pass product id as params
router.post("/review/:id", isBuyer, addReview);
router.get("/review", getReviews);



export default router;