import express from 'express';
import { getOrderDetails, updateOrderStatus } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.route('/:id').get(protect, admin, getOrderDetails);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;

