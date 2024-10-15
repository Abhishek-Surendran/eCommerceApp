import express from 'express';
import { createOrder, captureOrder } from '../controllers/paypalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/capture-order/:orderId', protect, captureOrder);

export default router;
