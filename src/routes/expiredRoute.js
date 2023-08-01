import express from 'express';
import cleanUp from '../controller/expiredProductController.js';

const router = express.Router();

router.delete('/cleanUp',cleanUp);

export default router;
